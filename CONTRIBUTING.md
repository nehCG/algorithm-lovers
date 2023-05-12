# Instruction before contributing

### Install Node.js

[Node.js](https://nodejs.org/en)

### Add a default.json file in config folder with the following

```json
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret"
}
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

# Potential Contribution Points
- **Code development**: Implement new features, fix bugs, or improve the performance and efficiency of the existing codebase.
- **Documentation**: Write or improve the existing documentation, making it easier for others to understand and use your project.
- **Testing**: Contribute to the creation or enhancement of test suites, ensuring the stability and reliability of the project.
- **User interface and user experience (UI/UX) improvements**: Enhance the design and usability of the project, making it more visually appealing and user-friendly.

# Contribution Guideline

1. **Fork the Repository**: Create a fork of the repository, which will create a copy of the project under your GitHub account.

2. **Clone the Fork**: Clone your forked repository to your local machine to make changes to the codebase.

3. **Create a Feature Branch**: Create a new branch for the feature or bugfix you're working on to keep your changes separate from the main branch.

4. **Make Changes and Commit**: Implement your changes, following the project's coding style and conventions. Commit your changes to the branch.

5. **Test Your Changes**: Run the project's test suite and ensure that all tests pass. If there are no existing tests for your changes, consider writing new tests.

6. **Update the Documentation**: Update any relevant documentation or create new documentation for the changes you've made.

7. **Push Changes to Your Fork**: Push your changes to your forked repository on GitHub.

8. **Create a Pull Request**: Submit a pull request from your fork's branch to the original project's main branch. Provide a detailed description of your changes and reference any related issues. See more instructions below.

# To do before opening a PR

Before submitting a pull request, please ensure you have completed the following tasks:

### Add Tests for New Features

For any new features implemented, please create corresponding test cases under the `tests` folder. This helps maintain the stability and reliability of the project.

### Verify the Project Builds and Passes Tests

Ensure the project builds successfully and passes all existing tests. To do this, run the following commands:

```bash
npm run build
npm run tests
```

### Fix Linting Issues

Make sure your code adheres to the project's coding style and conventions by running the linter and fixing any reported issues:
```bash
npm run lint
```

### Update Documentation

If your changes require updates to the documentation or if you've added new features, make sure to update the relevant documentation accordingly.

### Check for Conflicts

Before submitting your pull request, ensure your branch is up-to-date with the latest changes from the main branch to avoid conflicts.

### Summary of Changes

When creating your pull request, provide a detailed description of the changes you've made, including the problem you're solving, the solution you've implemented, and any related issues. This helps maintainers and other contributors understand the context of your changes and makes the review process more efficient.

Once you've completed these steps, you're ready to submit your pull request.