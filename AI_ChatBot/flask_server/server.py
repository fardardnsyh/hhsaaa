from flask import Flask, request, jsonify;
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from flask_cors import CORS, cross_origin  # Import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain.vectorstores import FAISS
from dotenv import load_dotenv
load_dotenv()
import os
import csv
api_key = os.environ.get('GOOGLE_API_KEY')
genai.configure(api_key=api_key);

app = Flask(__name__)
CORS(app)

text=""
pdf_reader=PdfReader('GFG_Course_Information.pdf');
for page in pdf_reader.pages:
 text+=page.extract_text()


def get_text_chunks(text):
 text_splitter=RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
 chunks=text_splitter.split_text(text)
 return chunks


def get_vector_store(text_chunks):
 embeddings=GoogleGenerativeAIEmbeddings(model="models/embedding-001")
 vector_store=FAISS.from_texts(text_chunks,embedding=embeddings)
 vector_store.save_local("faiss_index")
def get_conversational_chain():
 prompt_template="""
 Answer the question as detailed as possible from the provided context, make sure to provide all the details related to the asked query, if the user question is salutations like "Hello", "Hi" or any other commonly used salutations, reply with "Hi there! How can I help you today with your search for the perfect GFG course?" or "Hi there!  I can answer your questions about the GFG courses. What would you like to know?"
 if the answer is not in the provided context just say, "I couldn't find relevant information about that in the course description. Is there anything else I can help you with?", 
 don't provide the wrong answer\n\n
 Context: \n {context} \n
 Question: \n {question} \n

 Answer:
 """
 model=ChatGoogleGenerativeAI(model="gemini-pro",temperature=0.3)
 prompt=PromptTemplate(template=prompt_template, input_variables=["context","question"])
 chain=load_qa_chain(model,chain_type="stuff",prompt=prompt)
 return chain


def user_input(user_question):
 embeddings=GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
 new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
 docs = new_db.similarity_search(user_question)

 chain = get_conversational_chain()

 response = chain(
     {"input_documents":docs, "question": user_question}
     , return_only_outputs=True
 )
 
 return response

text_chunks = get_text_chunks(text)
get_vector_store(text_chunks)

# sample_user_question = "what is an Entity?"
# sample_response = user_input(sample_user_question)
# print(sample_response)

def submit_feedback(username, rating, message):
    feedback_file = os.path.join("sales_data", "feedback.csv")
    
    # Check if file already exists
    if not os.path.isfile(feedback_file):
        with open(feedback_file, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Username', 'Rating', 'Message'])
    
    with open(feedback_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([username, rating, message])

def push_new_query(new_query):
    new_query_file = os.path.join("sales_data", "newqueries.csv")
    
    if not os.path.isfile(new_query_file):
        with open(new_query_file, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Query'])
            
    words = new_query.split()
    
    with open(new_query_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(words)
    
    
@app.route('/ask', methods=['POST', 'GET'])
def ask_question():
    # return {"response": response}
    data = request.get_json()
    user_question = data.get('question', '')
    
    if not user_question:
        return jsonify({'error': 'Question not provided'}), 400
    
    response = user_input(user_question)
    return {"response": response}
    # return jsonify({'response': response}), 200

@app.route('/submit_feedback', methods=['POST', 'GET'])
def handle_feedback_submission():
    # return {"response": sample_response}
    data = request.get_json()
    username = data.get('username', '')
    rating = data.get('rating', '')
    message = data.get('message', '')
    
    if not all([username, rating, message]):
        return jsonify({'error': 'Incomplete data Provided'}), 400
    submit_feedback(username, rating, message)
    return {"message": "Feedback Successfully submitted!"}

@app.route('/new_query', methods=['POST', "GET"])
def handle_new_query_inclusion():
    data = request.get_json()
    new_query = data.get('newquery', '')
    
    if not new_query:
        return jsonify({'error': 'Query not Provided'}), 400
    
    push_new_query(new_query)
    return {"message": "New Query Successfully pushed"}

if __name__ == '__main__':
    app.run(debug=True)