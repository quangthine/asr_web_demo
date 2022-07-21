#!/usr/bin/env python
# -*- coding: utf-8 -*-
from sre_constants import SRE_FLAG_DEBUG
from flask import Flask
from flask import request
from flask import render_template
import flask
import os
import socket
from pydub import AudioSegment as am
from scipy.io import wavfile
import grpc
# import the generated classes
import stt_service_pb2
import stt_service_pb2_grpc
from google.protobuf.json_format import MessageToDict
import io
import wave
import json
import soundfile as sf
import time

CHANNEL_IP = 'localhost:5001'
channel = grpc.insecure_channel(CHANNEL_IP)
stub = stt_service_pb2_grpc.SttServiceStub(channel)
app = Flask(__name__)
def gen(audio_bytes):
    specification = stt_service_pb2.RecognitionSpec(
        partial_results=True,
        audio_encoding='LINEAR16_PCM',
        sample_rate_hertz=16000,
        enable_word_time_offsets=True,
        max_alternatives=5,
    )
    streaming_config = stt_service_pb2.RecognitionConfig(specification=specification)
    yield stt_service_pb2.StreamingRecognitionRequest(config=streaming_config, audio_content=audio_bytes)
def run_transcription(audio_bytes):
    it = stub.StreamingRecognize(gen(audio_bytes))
    try:
        for r in it:
            try:
                jres = MessageToDict(r)
                print(jres)
                if jres['chunks'][0]['final']:
                    return jres['chunks'][0]['alternatives'][0]['text']
            except LookupError:
                print('No available chunks')
    except grpc._channel._Rendezvous as err:
        print('Error code %s, message: %s' % (err._state.code, err._state.details))
    return ""
@app.route("/result", methods=['POST', 'GET'])
def index():
    transcript = ""
    total_time = 0.0
    if request.method == "POST":
        file = request.files['audio_data']
        print(file)

        file.seek(0)

        audio = am.from_file(file)
        audio = audio.set_frame_rate(16000)
        audio = audio.set_sample_width(2)
        audio = audio.set_channels(1)

        audio.export('audio.wav', format='wav')
        
        # print(audio.shape)

        # data, samplerate = sf.read(file)
        # with io.BytesIO() as fio:
        #     sf.write(
        #         fio, 
        #         audio, 
        #         samplerate=16000,
        #         subtype='PCM_16', 
        #         format='wav'
        #     )
        #     data = fio.getvalue()

        # with open(('audio.wav'), 'wb') as f:
        #     f.write(audio)
        with open("audio.wav", "rb") as f:
            audio = f.read()
        start_time = time.time()
        transcript = run_transcription(audio)
        end_time = time.time()
        total_time = end_time - start_time
        # response = flask.jsonify({'transcript': transcript, 'time': total_time})
        # response.headers.add('Access-Control-Allow-Origin', '*')
        # return response
    response = flask.jsonify({'cfm': {'transcript': transcript, 'time': round(total_time, 2)}})
    response.headers.add('Access-Control-Allow-Origin', '*')
    # print(transcript)
    # print(total_time)
    return response

if __name__ == "__main__":
    app.run(debug=True)
    # app.run(host='0.0.0.0',port=8000)