FROM ubuntu
RUN apt -y update
RUN apt -y install lcov curl
RUN apt -y install unzip
RUN echo 'export PATH="/root/.deno/bin:$PATH"' >> ~/.bashrc
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
