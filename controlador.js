const {client} = require('./db')
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")

const listUsers = async (req, res) => {
    res.send('lista de usuarios')
}

const createUser = async (req, res) => {
    try {
        const {nome, email, senha} = req.body;
        const senhacriptografada = await bcryptjs.hashSync(senha, 10)
        const sql = `INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *`
        const dados = await client.query(sql, [nome, email, senhacriptografada])
        res.status(201).json({msg:'O user foi criado com sucesso'})
    } catch (err){
        console.log(err)
        res.status(500).json({msg:'Erro ao criar o user'})
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const {nome, email} = req.body;
        const sql = `UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING *`
        const dados = await client.query(sql, [nome, email, id])
        console.log(dados)
        res.status(201).json({msg:'O user foi atualizado com sucesso'})
    } catch (err){
        console.log(err)
        res.status(500).json({msg:'Erro ao atualizar o user'})
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `DELETE FROM usuarios WHERE id = $1`
        const dados = await client.query(sql, [id])
        res.status(200).json({msg: 'O Usuario foi deletado'})
    } catch (err){
        console.log(err)
        res.status(500).json({msg:'Erro ao deletar o user'})
    }
    
}


const login = async (req, res) => {
    try{
        const {email, senha} = req.body;
        const sql = `SELECT * FROM usuarios WHERE email = $1`
        const usuario = await client.query(sql, [email])
        const validPassword = bcryptjs.compareSync(senha, usuario.rows[0].senha)
        console.log(validPassword)
        //fazer if else se o password for valido
        const token = jwt.sign(
            {
                _id: usuario.rows[0].id,
                email: usuario.rows[0].email,
                nome: usuario.rows[0].nome,
            },
            process.env.jwt_secret_key,
            { expiresIn: 1000*60*60*24*3}
        )

        res
        .status(200)
        .cookie("ROGERIO", token,{expires : exi})
        .json({msg: 'voce efetuou o login'})

    } catch(err){
        console.log(err)
        res.send(500)
    }
}




const getUser = async (req, res) => {
    res.send('pegou um usuario')
}

module.exports = { listUsers, createUser, updateUser, deleteUser, getUser, login };