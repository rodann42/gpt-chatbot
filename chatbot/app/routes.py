from app import app
from flask import request, jsonify
import os
import calendar
import time

import pinecone
from dotenv import load_dotenv

import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import openai


pinecone_index_name = "gpt-chatbot"
TEXT_EMBEDDING_MODEL = "text-embedding-ada-002"

def initialize_pinecone():
    load_dotenv()
    API_KEY = os.environ.get("PINECONE_API_KEY")
    ENV_KEY = os.environ.get("PINECONE_ENV")
    pinecone.init(api_key=API_KEY, environment=ENV_KEY)
    openai.api_key = os.environ.get("OPENAI_API_KEY")

def delete_existing_pinecone_index():
    if pinecone_index_name in pinecone.list_indexes():
        pinecone.delete_index(pinecone_index_name)

def create_pinecone_index():
    pinecone.create_index(name=pinecone_index_name, metric="cosine", shards=1, dimension=1536)
    pinecone_index = pinecone.Index(pinecone_index_name)

    return pinecone_index


def create_and_apply_model():
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    model = GPT2LMHeadModel.from_pretrained('gpt2')
    return tokenizer, model

def query_pinecone(search_term):
    query_question = str(search_term)
    query_vectors = [model.encode(query_question)]

    query_results = pinecone_index.query(queries=query_vectors, top_k=5)
    res = query_results[0]

    results_list = []

    for idx, _id in enumerate(res.ids):
        results_list.append({
            "id": _id,
            "question": df[df.qid1 == int(_id)].question1.values[0],
            "score": res.scores[idx],
        })

    return json.dumps(results_list)

initialize_pinecone()
# delete_existing_pinecone_index()
# pinecone_index = create_pinecone_index()
pinecone_index = pinecone.Index(pinecone_index_name)
tokenizer, model = create_and_apply_model()


@app.route('/')
@app.route('/index')
def index():
    return "hello"


@app.route('/usermsg', methods = ['POST'])
def handleMessage():
    
    # create and upload embeddings
    def generate_text(inp):
        input_ids = tokenizer.encode(inp, return_tensors='pt')
        beam_output = model.generate(input_ids, max_length=50, num_beams=5, no_repeat_ngram_size=2, early_stopping=True)
        output = tokenizer.decode(beam_output[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)
        return ".".join(output.split(".")[:-1]) + "."
    
    def upsert_pinecone(id, message):
        res = openai.Embedding.create(
            input=[message], 
            engine=TEXT_EMBEDDING_MODEL
        )
        vector = res["data"][0]["embedding"]
        try:
            upsert_response = pinecone_index.upsert([(id, vector)])
        except Exception as e:
            app.logger.info('Exception %s encountered when upserting message "%s"', e, message)
        finally:
            return

    message = request.json["message"]
    message_id = str(calendar.timegm(time.gmtime()))
    upsert_pinecone(message_id, message)
    result = generate_text(message)
    return jsonify(
        response=result
    )
