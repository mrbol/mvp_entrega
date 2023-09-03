from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote

from sqlalchemy.exc import IntegrityError

from model import Session, Devocional
from logger import logger
from schemas import *
from flask_cors import CORS

info = Info(title="Minha API", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# definindo tags
home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
devocional_tag = Tag(name="Devocional", description="Adição, visualização e remoção de devocional à base")

@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela que permite a escolha do estilo de documentação.
    """
    return redirect('/openapi')


@app.post('/devocional', tags=[devocional_tag],
          responses={"200": DevocionalViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_devocional(form: DevocionalSchema):
    """Adiciona um novo Devocional à base de dados

    Retorna uma representação dos devocionais.
    """
    devocional = Devocional(
        referencia= form.referencia,
        versiculo= form.versiculo,
        pensamento= form.pensamento,
        oracao= form.oracao)

    try:
        # criando conexão com a base
        session = Session()
        if form.id > 0:                      
            # atualizando o registro      
            devocional.id = form.id
            x = session.query(Devocional).get(form.id)
            x.referencia = form.referencia
            x.versiculo= form.versiculo
            x.pensamento= form.pensamento
            x.oracao= form.oracao         
        else:
            # adicionando registro
            session.add(devocional)            

        # efetivando o camando de adição de novo item na tabela
        session.commit()                
        return apresenta_devocional(devocional), 200

    except IntegrityError as e:
        # como a duplicidade do nome é a provável razão do IntegrityError
        error_msg = "Devocional de mesmo nome já salvo na base :/"
        return {"mesage": error_msg}, 409

    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível salvar novo item :/"
        logger.warning(f"Erro ao adicionar devocional '{devocional.referencia}', {error_msg}")        
        return {"mesage": error_msg}, 400



@app.get('/devocionals', tags=[devocional_tag],
         responses={"200": ListagemDevocionalsSchema, "404": ErrorSchema})
def get_devocionais():
    """Faz a busca por todos os devocionais cadastrados

    Retorna uma representação da listagem de devocionais.
    """
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    devocionais = session.query(Devocional).all()

    if not devocionais:
        # se não há devocionais cadastrados
        return {"devocionais": []}, 200
    else:
        logger.debug(f"%d devocionais econtrados" % len(devocionais))
        # retorna a representação de produto
        print(devocionais)
        return apresenta_devocionais(devocionais), 200


@app.get('/devocional', tags=[devocional_tag],
         responses={"200": DevocionalViewSchema, "404": ErrorSchema})
def get_devocional(query: DevocionalBuscaSchema):
    """Faz a busca por um Devocional a partir do id do devocional

    Retorna uma representação dos devocionais.
    """
    devocional_id = query.devocional_id
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    devocional = session.query(Devocional).filter(Devocional.id == devocional_id).first()

    if not devocional:
        # se o devocional não foi encontrado
        error_msg = "Devocional não encontrado na base :/"
        logger.warning(f"Erro ao buscar devocional '{devocional_id}', {error_msg}")        
        return {"mesage": error_msg}, 404
    else:
        logger.debug(f"Devocional econtrado: '{devocional.referencia}'")
        # retorna a representação de devocional
        return apresenta_devocional(devocional), 200


@app.delete('/devocional', tags=[devocional_tag],
            responses={"200": DevocionalDelSchema, "404": ErrorSchema})
def del_produto(query: DevocionalBuscaSchema):
    """Deleta um Devocional a partir do id informado

    Retorna uma mensagem de confirmação da remoção.
    """
    devocional_id = query.devocional_id

    # criando conexão com a base
    session = Session()
    # fazendo a remoção
    count = session.query(Devocional).filter(Devocional.id == devocional_id).delete()
    session.commit()

    if count:
        # retorna a representação da mensagem de confirmação
        logger.debug(f"Deletado Devocional #{devocional_id}")
        return {"mesage": "Devocional removido", "id": devocional_id}
    else:
        # se o devocionaçl não foi encontrado
        error_msg = "Devocional não encontrado na base :/"
        logger.warning(f"Erro ao deletar Devocional #'{devocional_id}', {error_msg}")
        return {"mesage": error_msg}, 404


