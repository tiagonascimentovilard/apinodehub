const { Pool, Client } = require('pg');
const pgAuth = require("./pg_auth");
const crypto = require("crypto");
//const client = new Client(pgAuth);

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
  try{
    const client = new Client(pgAuth);
    client.connect()
    const senhaHash = gerarSenhaHash(senha);
    const loginAjuste = login.toLowerCase();
    let sql = "INSERT INTO usuarios (login,hash1,hash2) VALUES ";
    sql += "  ('"+  loginAjuste +"','"+  senhaHash.hash +"','"+  senhaHash.salt +"') ";
    await client.query(sql).then((resp) => {
      res.status(200).json({message: 'Usuário criado!'});
    }).catch((error) => { 
      res.status(500).json({message: 'erro ao criar usuário!'+error});
    });
  } catch (err) {
    console.error(err);
  };
};


async function criarResponsavel(resp,res){
  try{
    await salvaEndereco(resp).then((end_id) => {
      const client = new Client(pgAuth);
      client.connect();
      let sql = "INSERT INTO responsaveis (nome,telefone,endereco_id) VALUES ";
      sql += " ('"+  resp.nome +"','"+  resp.telefone +"',"+  end_id +")";
      client.query(sql).then((resp) => {
        res.status(200).json({message: 'Responsável criado!'});
      }).catch((error) => { 
        res.status(500).json({message: 'erro ao criar Responsável!'+error});
      });
    });
  } catch (err) {
    console.error(err);
  };
};

async function criarEmpresa(empr,res){
  try{
    const client = new Client(pgAuth);
    client.connect();
    let sql = "INSERT INTO empresas (nome,cnpj,descricao,responsavel_principal_id,usuario_id) VALUES ";
    sql += " ('"+  empr.nome +"','"+  empr.cnpj +"','"+  empr.descricao +"',"+  empr.responsavel +""
    sql += " ,"+  empr.usuario_id +")";
    await client.query(sql).then((resp) => {
      res.status(200).json({message: 'empresa criada!'});
    }).catch((error) => { 
      res.status(500).json({message: 'erro ao criar empresa!'+error});
    });
  } catch (err) {
    console.error(err);
  };
};

async function criarLocal(loc,res){
  try{
    console.log(JSON.stringify(loc))
    await salvaEndereco(loc).then((end_id) => {
      const client = new Client(pgAuth);
      client.connect();
      let sql = "INSERT INTO locais (nome,endereco_id,empresa_id,responsavel_id,usuario_id) VALUES ";
      sql += " ('"+  loc.nome +"',"+  end_id +","+  loc.empresa_id +","+  loc.responsavel_id +"";
      sql += " ,"+  loc.usuario_id +")";
      console.log(sql)
      client.query(sql).then((resp) => {
        res.status(200).json({message: 'Local criado!'});
      }).catch((error) => { 
        res.status(500).json({message: 'erro ao criar local!'+error});
      });
    });
  } catch (err) {
    console.error(err);
  };
};

async function salvaEndereco(ender){
  try{
    const clientE = new Client(pgAuth);
    clientE.connect();
    let sql = "INSERT INTO enderecos (cep,logradouro,numero,";
    sql += "bairro,municipio,uf,usuario_id) VALUES ";
    sql += " ('"+  ender.cep +"','"+  ender.logradouro +"'";
    sql += " ,'"+  ender.numero +"','"+  ender.bairro +"','"+  ender.municipio +"','"+  ender.uf +"'"
    sql += " ,"+  ender.usuario_id +")"

    return await clientE.query(sql).then((resp) => {
      const clientM = new Client(pgAuth);
      clientM.connect();
      return clientM.query('SELECT MAX(id) as id FROM enderecos').then((maxid) => {
        return maxid.rows[0].id;
      });
    });
  } catch (err) {
    console.error(err);
  };
};

async function validaSenhaHash(login,senha,res){
  try{
    const client = new Client(pgAuth);
    client.connect();
    const jwt = require('jsonwebtoken');
    const loginAjuste = login.toLowerCase();
    let sql = "SELECT id, login, hash1, hash2 FROM usuarios  ";
    sql += " WHERE login = '" + loginAjuste + "' ;";
    await client.query(sql).then((resp) => {
      const usuario = resp.rows;
      if (usuario[0].length === 0){
        res.status(403).json({message: 'Login ou Senha inválida!'});
      }else{
        const validaSenha = validaSenhaHashSha512(senha, usuario[0].hash1, usuario[0].hash2);
        if (validaSenha){
          console.log(JSON.stringify(usuario));
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
    }).catch((error) => { 
      res.status(500).json({message: 'erro no processo de consulta do usuario no DB! '+error});
    });
  } catch (err) {
    console.error(err);
  };
};


async function listaEmpresas(usuarioId,res){
  try{
    const client = new Client(pgAuth);
    client.connect();
    let sql = "SELECT e.id,r.nome as nome_responsavel,e.nome,e.cnpj ";
    sql += " FROM responsaveis r INNER JOIN empresas e "; 
    sql += " ON e.responsavel_principal_id=r.id  "; 
    sql += " WHERE e.usuario_id = " + usuarioId + " ";
    sql += " ORDER BY e.nome ASC  "; 
    await client.query(sql).then((resp) => {
      const empresas = resp.rows;
      if (empresas.length === 0){
        res.status(403).json({message: 'Nenhuma empresa cadastrado.'});
      }else{
        res.status(200).json(empresas);
      };
    }).catch((error) => { 
      res.status(500).json({message: 'erro no processo de consulta de empresa no DB! '+error});
    });
  } catch (err) {
    console.error(err);
  };
};

async function listaLocais(usuarioId,res){
  try{
    const client = new Client(pgAuth);
    client.connect();
    let sql = "SELECT l.id, l.nome, r.nome as responsavel, e.nome as empresa ";
    sql += " FROM locais l INNER JOIN empresas e ON e.id=l.empresa_id "; 
    sql += " INNER JOIN enderecos en ON en.id=l.endereco_id "; 
    sql += " INNER JOIN responsaveis r ON r.id=l.responsavel_id "; 
    sql += " WHERE l.usuario_id = " + usuarioId + " ";
    sql += " ORDER BY l.nome ASC  "; 
    //console.log(sql)
    await client.query(sql).then((resp) => {
      const locais = resp.rows;
      if (locais.length === 0){
        res.status(403).json({message: 'Nenhuma local cadastrado.'});
      }else{
        res.status(200).json(locais);
      };
    }).catch((error) => { 
      res.status(500).json({message: 'erro no processo de consulta de local no DB! '+error});
    });
  } catch (err) {
    console.error(err);
  };
};

async function listaResponsaveis(usuarioId,res){
  try{
    const client = new Client(pgAuth);
    client.connect();
    let sql = "SELECT r.id,r.nome,r.telefone,e.cep,e.logradouro,e.numero,";
    sql += "e.bairro,e.municipio,e.uf FROM responsaveis r INNER JOIN enderecos e "; 
    sql += " ON e.id=r.endereco_id  "; 
    sql += " WHERE e.usuario_id = " + usuarioId + " ";
    sql += " ORDER BY r.nome ASC  "; 
    await client.query(sql).then((resp) => {
      const responsaveis = resp.rows;
      if (responsaveis.length === 0){
        res.status(403).json({message: 'Nenhum responsável cadastrado.'});
      }else{
        console.log(JSON.stringify(responsaveis));
          res.status(200).json(responsaveis);
      };
    }).catch((error) => { 
      res.status(500).json({message: 'erro no processo de consulta do responsável no DB! '+error});
    });
  } catch (err) {
    console.error(err);
  };
};

module.exports = {listaLocais,criarLocal,listaEmpresas,criarEmpresa,listaResponsaveis,criarResponsavel,validaSenhaHash,criarUsuario};