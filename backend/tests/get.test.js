const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();



describe('GET /contacts', () => {

    let response;
    let resultado;
    let userToken;

    before(async () => {
        var server = await init();
        const user = {
            email: "apolo.almeida@teste.com",
            password: "teste@123"
        }

        resultado = await server.inject({
            method: 'get',
            url: '/user/' + user.email
        })

        if (resultado.statusCode === 200) {
            await server.inject({
                method: 'delete',
                url: '/user/' + resultado.result._id
            })
        }

        await server.inject({
            method: 'post',
            url: '/user',
            payload: user
        })

        response = await server.inject({
            method: 'post',
            url: '/session',
            payload: user
        })

        userToken = response.result.user_token

        response = await server.inject({
            method: 'get',
            url: '/contacts',
            headers: { "Authorization": userToken}
        })
    });
    
    it('deve retornar 200', async () => {
        // console.log(response.result);
        expect(response.statusCode).to.equal(200)
    });

    it('deve retornar uma lista', async () => {
        // console.log(response);
        expect(response.result).to.be.array()
    });
});