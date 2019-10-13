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

- Relevant tutorials:

	[Flask tutorial](https://flask.palletsprojects.com/en/1.1.x/tutorial/)

	[Git tutorial](https://git-scm.com/docs/gittutorial)

## Work flow

Let's say you want to add a feature, called A, to our code. Take the following steps:

1. From the main branch (`version1.0` for our case), create a new branch for your feature.

		# This makes sure that you are on the main branch
		git checkout version1.0
		# This creates a new branch, with content identical to the main branch.
		# Whatever change you make from now on will go into this featureA branch instead of the main branch.
		git checkout -b featureA
		# Make all the code changes you want
		git add [lists of files that you modified/created] # e.g. git add app/__init__.py, if you changed app/__init__.py
		# Write your change into a "commit" along with a message that briefly explains the purpose for your change
		git commit -m "Your commit message"
		# This creates a remote branch ("remote" means on GitHub.com instead of on your computer) for your branch
		git push origin featureA

2. After pushing your branch, if you realized that there are stuff you forgot to include in the same commit, do the following:

		# see whether your changes was really made
		git status
		# stage your changes
		git add [list of changes you want to include]
		# add the staged changes to your previous commit (this is the meaning of "--amend")
		# and tell git to reuse the commit message of the previous commit (this is the meaning of "--no-edit")
		git commit --amend --no-edit
		# The -f is very important (forced push)
		git push -f origin featureA

## Development plan

### 1st Iteration

Make a bot that responses to the user click.

### 2nd iteration

Implement the login, register.

### 3rd iteration

Beautify the interface and make the bot becomes smarter.

