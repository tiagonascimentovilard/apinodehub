const axios = require('axios');

exports.get = (req, res, next) => {
    let cep = req.params.cep;
    let urlViaCep = 'https://viacep.com.br/ws/'+cep+'/json/';
    (async () => {
        try{
            await axios.get(urlViaCep).then((resposta) => {
                res.status(200).json(resposta.data);
            });
        } catch (err) {
            res.status(500).json([{msg: " CEP não localizado! "+err}]);
        }
    })();
 };