FROM mcr.microsoft.com/devcontainers/base:ubuntu26.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    zsh \
    git \
 && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs && apt-get clean

RUN mkdir -p /workspaces/nestjs-libs && \
    chown vscode:vscode /workspaces/nestjs-libs

USER vscode
WORKDIR /workspaces/nestjs-libs

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash && \
    mkdir -p /home/vscode/.local/bin && \
    ln -s /home/vscode/.bun/bin/bun /home/vscode/.local/bin/bun && \
    ln -s /home/vscode/.bun/bin/bunx /home/vscode/.local/bin/bunx
ENV PATH="/home/vscode/.bun/bin:/home/vscode/.local/bin:${PATH}"

# Install oh-my-zsh
RUN rm -rf /home/vscode/.oh-my-zsh
COPY --chown=vscode:vscode .zshrc /home/vscode/.zshrc
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
ENV SHELL=/usr/bin/zsh


