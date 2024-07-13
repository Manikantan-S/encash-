from flask import Flask, request, jsonify
from flask_cors import CORS
from IndicTransTokenizer import IndicProcessor, IndicTransTokenizer
from transformers import AutoModelForSeq2SeqLM
import torch
from embedchain import App
import os

os.environ["HUGGINGFACE_ACCESS_TOKEN"] = "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"
embedchain_app_mistral = App.from_config("/home/karthik/Desktop/IndicTrans2/huggingface_interface/mistral.yaml")


# Initialize Flask app
flask_app = Flask(__name__)
CORS(flask_app)

# Initialize IndicTrans2 components
tokenizer_en_indic = IndicTransTokenizer(direction="en-indic")
tokenizer_indic_en = IndicTransTokenizer(direction="indic-en")
ip = IndicProcessor(inference=True)

# Initialize AI4Bharat Translation Models
model_en_indic = AutoModelForSeq2SeqLM.from_pretrained("ai4bharat/indictrans2-en-indic-dist-200M", trust_remote_code=True)
model_indic_en = AutoModelForSeq2SeqLM.from_pretrained("ai4bharat/indictrans2-indic-en-1B", trust_remote_code=True)

# Initialize Embedchain App
embedchain_app_mistral = App.from_config("/home/karthik/Desktop/IndicTrans2/huggingface_interface/mistral.yaml")

# Define supported languages mapping
languages = {
    "asm_Beng": "Assamese",
    "kas_Arab": "Kashmiri (Arabic)",
    "pan_Guru": "Punjabi",
    "ben_Beng": "Bengali",
    "kas_Deva": "Kashmiri (Devanagari)",
    "san_Deva": "Sanskrit",
    "brx_Deva": "Bodo",
    "mai_Deva": "Maithili",
    "sat_Olck": "Santali",
    "doi_Deva": "Dogri",
    "mal_Mlym": "Malayalam",
    "snd_Arab": "Sindhi (Arabic)",
    "eng_Latn": "English",
    "mar_Deva": "Marathi",
    "snd_Deva": "Sindhi (Devanagari)",
    "gom_Deva": "Konkani",
    "mni_Beng": "Manipuri (Bengali)",
    "tam_Taml": "Tamil",
    "guj_Gujr": "Gujarati",
    "mni_Mtei": "Manipuri (Meitei)",
    "tel_Telu": "Telugu",
    "hin_Deva": "Hindi",
    "npi_Deva": "Nepali",
    "urd_Arab": "Urdu",
    "kan_Knda": "Kannada",
    "ory_Orya": "Odia",
}

@flask_app.route('/languages', methods=['GET'])
def get_languages():
    return jsonify(languages)

@flask_app.route('/translated_mistral', methods=['POST'])
def translated_query_mistral():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        src_lang = data.get('src_lang', 'tam_Taml')
        tgt_lang = 'eng_Latn'
        reference = data.get('reference', '')

        # Translate input text to English
        batch = ip.preprocess_batch([prompt], src_lang=src_lang, tgt_lang=tgt_lang)
        batch = tokenizer_indic_en(batch, src=True, return_tensors="pt")

        with torch.inference_mode():
            translated_input = model_indic_en.generate(**batch, num_beams=5, num_return_sequences=1, max_length=256)

        translated_input = tokenizer_indic_en.batch_decode(translated_input, src=False)[0]
        print("Input in English: ", translated_input)

        # Construct the query dynamically
        query = f"Add a  short marketing advertisement related to {prompt} as mentioned in the query"
        prompt = query + translated_input

        # Query Embedchain
        result = embedchain_app_mistral.query(prompt)
        answer_index = result.find("Answer")
        if answer_index != -1:
            embedchain_result = result[answer_index + len("Answer:"):] + "\n"
        else:
            embedchain_result = "No result"

        print("Embedchain result in English: ", embedchain_result)

        # Translate Embedchain result back to the original source language using IndicTrans2
        batch = ip.preprocess_batch([embedchain_result], src_lang=tgt_lang, tgt_lang=src_lang)
        batch = tokenizer_en_indic(batch, src=True, return_tensors="pt")

        with torch.inference_mode():
            translated_result = model_en_indic.generate(**batch, num_beams=5, num_return_sequences=1, max_length=300)

        translated_result = tokenizer_en_indic.batch_decode(translated_result, src=False)[0]

        # Post-process the translated result
        translated_result = ip.postprocess_batch([translated_result], lang=src_lang)
        print("Translated result:", translated_result)

        return jsonify({'translated_result': translated_result})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    flask_app.run(debug=False)

