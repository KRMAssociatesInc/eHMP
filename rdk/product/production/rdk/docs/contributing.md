::: page-description
Contributing
============
:::

## Development Environment

Set up the standard [development environment](development.md) before committing code.

## Code Review Checklist
 * Of the [Style Guide](style-guide.md),
    * Every RDK-Specific Guideline is followed
    * Every JavaScript Guideline is followed
    * Every General Programming Guideline is followed
    * The JSDoc Guidelines are followed
    * New code does not show any JS pitfalls or gotchas
 * Of the [Unit Test and Integration Test Guidelines](testing.md), every guideline is followed.
 * If the commits do not follow the Git Basics below, review the section with the committer.


## Git Basics

In order to contribute code, you need to be familiar with Git.


### Branches

Branch names should be all lowercase letters with dash-separated words.

Branch naming conventions:
 * for new functionality:
    * `us0001-short-description`  
    * where us0001 is the user story ID, if applicable
 * for bug fixes:
    * `master-de0001-short-description`
    * where `master` is the branch that the defect was created for (`r1.2`, for example) and `de0001` is the defect ID, if applicable


### Commits

A uniform commit message format is important for easy and accurate tracking of history.

The text up to the first blank line of the commit message is treated as the title, and the rest of the message is the body.

Commit message requirements:
 * The title should be no longer than 50 characters.
 * The title should imperatively describe what action the commit makes. For example, "Add authentication unit tests".
    * No declarative statements ("Added authentication unit tests" - BAD)
 * The title should use sentence case (just capitalize the first letter of the sentence).
 * Do not end the title with a period.
 * Wrap the body at 72 characters.
 * Use the body to explain what and why, not to explain how.

Commit change requirements:
 * Commits should be atomic. Commits should do one thing. All changes on a commit must relate to the commit message. Do not add changes which do not relate to the commit message.
    * Commits which have changes unrelated to the commit message make understanding git history difficult.
    * Atomic commits make cherry-picking, resolving merge conflicts, and reverting simple.

Tips:
 * If you've already made many changes without committing along the way, and you have many changes to commit, use `git add --patch` and make sure not to commit with the `-a` flag.
    * SourceTree or `git gui` make this easier with buttons that let you add individual chunks to commit.
 * Git GUI tools are useful for observation, but usually obscure how git commands are performed, so learn the simple git command-line interface to avoid confusion and mistakes.


<br />
---
Next: [Style Guide](style-guide.md)
