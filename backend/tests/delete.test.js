const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();


describe('DELETE /contacts', () => {

    let response;
    let resultado;
    let userToken;

    before(async () => {
        var server = await init();
        const user = {
            email: "apolo.monteiro@teste.com",
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
    });
   
    describe('dado que eu tenho um contato indesejado', () => {
        
        
        let contact = {
            name: "Joaquim Xavier",
            number: "31987654321",
            description: "Lorem Ispum Test II Test One More Time"
        }

        let server;
        let contactId;

        before(async () => {
            server = await init();

            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })

            contactId = response.result._id
        });

        it('quando eu apago esse contato', async () => {
            response = await server.inject({
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: { "Authorization": userToken}
            })
        });

        it('deve retornar 204', async () => {
            expect(response.statusCode).to.equal(204)
        });

    });

    describe('dado que eu não tenho autorização', () => {
        
        
        let contact = {
            name: "Joaquim Silva",
            number: "31987654309",
            description: "Lorem Ispum Test II Test One More Time Two."
        }

        let server;
        let contactId;

        before(async () => {
            server = await init();

            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })

            contactId = response.result._id
        });

        it('quando eu tento apago esse contato', async () => {
            response = await server.inject({
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: { "Authorization": '621150b8c648612425abc1ff'}
            })
        });

        it('deve retornar 401', async () => {
            expect(response.statusCode).to.equal(401)
        });

    });
});