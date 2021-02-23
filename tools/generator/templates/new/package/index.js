module.exports = {
  prompt: ({ prompter }) => {
    const questions = [
      {
        type: "input",
        name: "packageName",
        message: "What is the package name?",
      },
      {
        type: "input",
        name: "dir",
        message: "Where is the directory(Optional)",
      },
    ];
    return prompter.prompt(questions).then((answers) => {
      const { packageName: _packageName, dir } = answers;
      const packageName = _packageName.toLowerCase().replace(/\s/, "-");
      const path = `${dir ? `${dir}/` : ``}${packageName}`;
      const absPath = `packages/${path}`;
      return { ...answers, path, absPath };
    });
  },
};
