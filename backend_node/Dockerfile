FROM node:14
COPY . /test
WORKDIR /test
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["server.js"]
