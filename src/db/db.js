const pgAuth = require("./pg_auth");
const crypto = require("crypto");
const { Client } = require('pg');

function gerarSalt(){
  return  crypto.randomBytes(16).toString('hex');
};

function sha512(senha, salt){
  var hash = crypto.createHmac('sha512', salt); 
  hash.update(senha);
  var hash = hash.digest('hex');
  return {salt,hash,};
};

function gerarSenhaHash(senha) {
  var salt = gerarSalt(); 
  return sha512(senha, salt); 
};

function validaSenhaHashSha512(senha, hashDB, saltHashDB){
  var hashTentativaLogin = crypto.createHmac('sha512', saltHashDB); 
  hashTentativaLogin.update(senha);
  var hashTentativaLogin = hashTentativaLogin.digest('hex');

  if (hashDB == hashTentativaLogin){
    return true;
  }else{
    return false;
  };
};

async function criarUsuario(login,senha,res){

  const pool = new Client(pgAuth);
  await pool.connect()

  try{
    const senhaHash = gerarSenhaHash(senha);
    const loginAjuste = login.toLowerCase();
    let sql = "INSERT INTO usuarios (login,hash1,hash2) VALUES ";
    sql += "  ('"+  loginAjuste +"','"+  senhaHash.hash +"','"+  senhaHash.salt +"') ";
    await pool.query(sql).then((resp) => {
      pool.end();
      res.status(200).json({message: 'Usuário criado!'});
    });
  } catch (err) {
    res.status(500).json({message: 'erro ao criar usuário!'+error});
  };

};


async function criarResponsavel(resp,res){

  const pool = new Client(pgAuth);
  pool.connect();

  try{
    await salvaEndereco(resp).then((end_id) => {
      let sql = "INSERT INTO responsaveis (nome,telefone,endereco_id) VALUES ";
      sql += " ('"+  resp.nome +"','"+  resp.telefone +"',"+  end_id +")";
      pool.query(sql).then((resp) => {
        pool.end();
        res.status(200).json({message: 'Responsável criado!'});
      });
    });
  } catch (err) {
    res.status(500).json({message: 'erro ao criar Responsável!'+error});
  };

};

async function criarEmpresa(empr,res){

  const pool = new Client(pgAuth);
  pool.connect();

  try{

    const text = 'INSERT INTO empresas(nome,cnpj,descricao,responsavel_principal_id,usuario_id) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const values = [ empr.nome , empr.cnpj , empr.descricao ,  empr.responsavel , empr.usuario_id ];

    await pool.query(text, values).then(maxid => {
      salvaResponsavelEmpresa(maxid.rows[0].id,empr.responsavel).then(resp => {
        res.status(200).json({message: 'empresa criada!'}) 
      });
      pool.end();
    });

  } catch (err) {
    console.error(err);
  };
};

async function salvaResponsavelEmpresa(idEmpr,idRespon){

  const pool = new Client(pgAuth);
  await pool.connect();

  let sql = "UPDATE responsaveis SET empresa_id=" + idEmpr + " WHERE id = "+ idRespon ;
  await pool.query(sql);
  await pool.end();

};

async function criarLocal(loc,res){

  const pool = new Client(pgAuth);
  pool.connect();

  await salvaEndereco(loc).then((end_id) => {
    const text = 'INSERT INTO locais(nome,endereco_id,empresa_id,responsavel_id,usuario_id) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const values = [  loc.nome ,  end_id , loc.empresa_id ,  loc.responsavel_id, loc.usuario_id  ];
    try {
      pool.query(text, values).then(maxid => {
        salvaResponsavelLocal(maxid.rows[0].id ,loc.responsavel_id).then(resp => {
          res.status(200).json({message: 'Local criado!'})
        });
        pool.end();
      })
    } catch (err) {
      console.log(err.stack);
    };
  });
};

async function salvaResponsavelLocal(idLocal,idRespon){

  const pool = new Client(pgAuth);
  let sql = "UPDATE responsaveis SET local_id=" + idLocal + " WHERE id = "+ idRespon ;
  await pool.connect();
  await pool.query(sql);
  await pool.end();

};

async function salvaEndereco(ender){

  const pool = new Client(pgAuth);  
  await pool.connect();
  const text = 'INSERT INTO enderecos(cep,logradouro,numero,bairro,municipio,uf,usuario_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
  const values = [ ender.cep ,  ender.logradouro  ,  ender.numero ,  ender.bairro ,  ender.municipio ,  ender.uf ,  ender.usuario_id ];

  try {
    const res = await pool.query(text, values);
    const IdEndereco = res.rows[0].id;
    await pool.end();
    return IdEndereco;
  } catch (err) {
    console.log(err.stack);
  };

};

async function validaSenhaHash(login,senha,res){

  const jwt = require('jsonwebtoken');
  const loginAjuste = login.toLowerCase();
  const pool = new Client(pgAuth);
  let sql = "SELECT id, login, hash1, hash2 FROM usuarios  ";
  sql += " WHERE login = '" + loginAjuste + "' ;";
  await pool.connect();

  await pool.query(sql, (err, result) => {
    const usuario = result.rows;
    pool.end();
    if (usuario[0].length === 0){
      res.status(403).json({message: 'Login ou Senha inválida!'});
    }else{
      const validaSenha = validaSenhaHashSha512(senha, usuario[0].hash1, usuario[0].hash2);
      if (validaSenha){
        const id = parseInt(usuario[0].id);
        const token = jwt.sign({ id }, process.env.SECRET, {
          //expiresIn: 3600 // expires in 1hs
          expiresIn: 720 // expires in 20min
        });
        res.json({ auth: true, token: token, userid: id, login: loginAjuste});
      }else{
        res.status(403).json({message: 'Login ou Senha inválida!'});
      };
    };
  });

};


async function listaEmpresas(usuarioId,res){

  const pool = new Client(pgAuth);
  await pool.connect();

  try{
    let sql = "SELECT e.id,r.nome as nome_responsavel,e.nome,e.cnpj, r.id as responsavel_id ";
    sql += " FROM responsaveis r INNER JOIN empresas e "; 
    sql += " ON e.responsavel_principal_id=r.id  "; 
    sql += " WHERE e.usuario_id = " + usuarioId + " ";
    sql += " ORDER BY e.nome ASC  "; 

    await pool.query(sql).then((resp) => {
      const empresas = resp.rows;
      pool.end();
      if (empresas.length === 0){
        res.status(403).json({message: 'Nenhuma empresa cadastrado.'});
      }else{
        res.status(200).json(empresas);
      };
    });
  } catch (err) {
    res.status(500).json({message: 'erro no processo de consulta de empresa no DB! '+error});
  };
  
};

async function listaLocais(usuarioId,res){

  const pool = new Client(pgAuth);
  await pool.connect();

  try{
    let sql = "SELECT l.id, l.nome, r.nome as responsavel, e.nome as empresa, l.empresa_id, l.responsavel_id ";
    sql += " FROM locais l INNER JOIN empresas e ON e.id=l.empresa_id "; 
    sql += " INNER JOIN enderecos en ON en.id=l.endereco_id "; 
    sql += " INNER JOIN responsaveis r ON r.id=l.responsavel_id "; 
    sql += " WHERE l.usuario_id = " + usuarioId + " ";
    sql += " ORDER BY l.nome ASC  "; 

    await pool.query(sql).then((resp) => {
      const locais = resp.rows;
      pool.end();
      if (locais.length === 0){
        res.status(403).json({message: 'Nenhuma local cadastrado.'});
      }else{
        res.status(200).json(locais);
      };
    });
  } catch (err) {
    res.status(500).json({message: 'erro no processo de consulta de local no DB! '+error});
  };
};

async function listaResponsaveis(usuarioId,res){

  const pool = new Client(pgAuth);
  await pool.connect();

  try{
    let sql = "SELECT r.id,r.nome,r.telefone,e.cep,e.logradouro,e.numero,";
    sql += "e.bairro,e.municipio,e.uf, r.empresa_id, r.local_id "; 
    sql += " FROM responsaveis r INNER JOIN enderecos e ON e.id=r.endereco_id  "; 
    sql += " WHERE e.usuario_id = " + usuarioId + " ";
    sql += " ORDER BY r.nome ASC  "; 

    await pool.query(sql).then((resp) => {
      const responsaveis = resp.rows;
      pool.end();
      if (responsaveis.length === 0){
        res.status(403).json({message: 'Nenhum responsável cadastrado.'});
      }else{
        res.status(200).json(responsaveis);
      };
    });
  } catch (err) {
    res.status(500).json({message: 'erro no processo de consulta do responsável no DB! '+error});
  };

};

module.exports = {salvaResponsavelLocal,salvaResponsavelEmpresa,listaLocais,criarLocal,listaEmpresas,criarEmpresa,listaResponsaveis,criarResponsavel,validaSenhaHash,criarUsuario};