# CS 50 Final Project - The game of TicTacToe

## Setup local development

- First install [Conda](https://conda.io/projects/conda/en/latest/user-guide/install/index.html?highlight=conda), a package management tool that acts as a one-stop-shop you can go to to install any package you need.

- Create a environment from the `environment.yml` file.

		conda env create -n tictactoe_env -f environment.yml

`environment.yml` is a file that records the packages required to develop this application. The command above creates an environment that contains packages specified in `environment.yml` file.

- In the future, if new packages were to be install for development purpose (e.g. [Numpy](https://anaconda.org/anaconda/numpy)), they need to be installed to the environment that you have created above and the changes need to be written to `environment.yml`:

		conda activate tictactoe_env
		conda install -c anaconda numpy
		conda env export > environment.yml
		conda deactivate tictactoe_env

Commit this change as an isolated commit and push to github.

## Development

- Activate your environment

		conda activate tictactoe_env

This activates all the packages in your `tictactoe_env`.

- Run the application for MacOS or Linux:

		export FLASK_APP=app
		export FLASK_ENV=development
		flask run

For Windows, please take a look at this [link](https://flask.palletsprojects.com/en/1.1.x/tutorial/factory/)

## Development plan

### 1st Iteration

Make a bot that responses to the user click.

### 2nd iteration

Implement the login, register.

### 3rd iteration

Beautify the interface and make the bot becomes smarter.

