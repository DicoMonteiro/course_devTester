const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();



describe('POST /contacts', () => {

    let response;
    let resultado;
    let userToken;

    before(async () => {
        var server = await init();
        const user = {
            email: "dico.monteiro@teste.com",
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

    describe('quando o payload é bonitão', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "João de Barro",
                number: "81966666666",
                description: "Lorem Ispum Test"
            }

            resultado = await server.inject({
                method: 'get',
                url: '/contacts/' + contact.number,
                headers: { "Authorization": userToken}
            })

            // console.log(resultado.result)
            // console.log(resultado.statusCode)
            if (resultado.statusCode === 200) {
                await server.inject({
                    method: 'delete',
                    url: '/contacts/' + resultado.result._id,
                    headers: { "Authorization": userToken}
                })
            }
            
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        
        it('deve retornar 200', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(200)
        });
    
        it('deve retornar o id do contato', async () => {
            // console.log(response.result);
            expect(response.result).to.exist('_id')
            expect(response.result._id).to.be.a.object()
            expect(response.result._id.toString().length).to.equal(24)
        });
    });

    describe('quando o número é duplicado', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "Paula da Silva",
                number: "81977777777",
                description: "Lorem Ispum Test"
            }

            await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
            
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        
        it('deve retornar 409', async () => {
            expect(response.statusCode).to.equal(409)
        });
    
        it('deve retornar a mensagem de duplicidade', async () => {
            expect(response.result.error).to.equal('Duplicated number.')
        });
    });

    describe('quando o payload não tem o campo nome', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                number: "11966666666",
                description: "Lorem Ispum Test"
            }
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        it('deve retornar 409', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(409)
        });

        it('deve retornar uma mensagem', async () => {
            expect(response.result.message).to.equal('Name is required.')
        });
    });

    describe('quando o payload o campo nome está em branco', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "",
                number: "11966666666",
                description: "Lorem Ispum Test"
            }
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        it('deve retornar 409', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(409)
        });

        it('deve retornar uma mensagem', async () => {
            expect(response.result.message).to.equal('Name is required.')
        });
    });

    describe('quando o payload não tem o campo whatsapp', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "João de Barro",
                description: "Lorem Ispum Test"
            }
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        it('deve retornar 409', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(409)
        });

        it('deve retornar uma mensagem', async () => {
            expect(response.result.message).to.equal('Number is required.')
        });
    });

    describe('quando o payload o campo whatsapp está em branco', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "João de Barro",
                number: "",
                description: "Lorem Ispum Test"
            }
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        it('deve retornar 409', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(409)
        });

        it('deve retornar uma mensagem', async () => {
            expect(response.result.message).to.equal('Number is required.')
        });
    });
    
    describe('quando o payload não tem o campo assunto', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "João de Barro",
                number: "11955555555"
            }
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        it('deve retornar 409', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(409)
        });

        it('deve retornar uma mensagem', async () => {
            expect(response.result.message).to.equal('Description is required.')
        });
    });

    describe('quando o payload o campo assunto está em branco', () => {
        before(async () => {
            var server = await init();
    
            let contact = {
                name: "João de Barro",
                number: "11955555555",
                description: ""
            }
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { "Authorization": userToken}
            })
        });
        it('deve retornar 409', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(409)
        });

        it('deve retornar uma mensagem', async () => {
            expect(response.result.message).to.equal('Description is required.')
        });
    });

    describe('quando o payload é nulo', () => {
        before(async () => {
            var server = await init();
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: null,
                headers: { "Authorization": userToken}
            })
        });
        
        it('deve retornar 400', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(400)
        });
    
    });

    describe('quando não tenho acesso', () => {
        before(async () => {
            var server = await init();
    
            response = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: null,
                headers: { "Authorization": '621150b8c648612425abc1ff'}
            })
        });
        
        it('deve retornar 401', async () => {
            // console.log(response.result);
            expect(response.statusCode).to.equal(401)
        });
    
    });
});