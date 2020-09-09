FROM ubuntu
RUN apt-get update -y
RUN apt-get install python3 python3-pip -y
COPY . /test
WORKDIR /test
RUN pip3 install flask
RUN export FLASK_APP=server.py
RUN pwd
ENTRYPOINT ["python3"]
CMD ["server.py"]
