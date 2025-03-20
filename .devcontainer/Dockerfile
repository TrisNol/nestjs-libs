FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    zsh \
    git \
 && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs && apt-get clean

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun && \
    ln -s $HOME/.bun/bin/bunx /usr/local/bin/bunx
ENV PATH="/root/.bun/bin:$PATH"

# Install Docker
RUN echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | \
    tee /etc/apt/sources.list.d/docker.list
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | \
    gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN apt update && apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin && apt clean
# # Fix issue inside /etc/init.d/docker
RUN sed -i 's/ulimit -Hn/ulimit -n/g' /etc/init.d/docker

# Install oh-my-zsh
RUN rm -rf ~/.oh-my-zsh
COPY .zshrc ~/.zshrc
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
ENV SHELL=/usr/bin/zsh


