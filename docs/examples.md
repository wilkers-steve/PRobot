# Examples

_**Heads up!** these examples include configuration options that are aspirational and not implemented yet._

Here are some examples of interesting things you can do by combining these components.

```
# Post welcome message for new contributors
on issues.opened or pull_request.opened
when first_time_contributor # plugins could implement conditions like this
then comment(file(".github/NEW_CONTRIBUTOR_TEMPLATE.md"));

# Auto-close new pull requests
on pull_request.opened
then comment("Sorry @{{ user.login }}, pull requests are not accepted on this repository.")
and close;

# Close issues with no body
on issues.opened
when payload.body matches /^$/
then comment("Hey @{{ user.login }}, you didn't include a description of the problem, so we're closing this issue.");

# @mention watchers when label added
on *.labeled then
# TODO: figure out syntax for loading watchers from file
comment("Hey {{ mentions }}, you wanted to know when the `{{ payload.label.name }}` label was added.");

# Assign a reviewer for new bugs
on pull_request.labeled
when labeled(bug)
then assign(random(file(OWNERS)));

# Perform actions based on content of comments
on issue_comment.opened
when payload.issue.body matches /^@probot assign @(\w+)$/
then assign({{ matches[0] }})

on issue_comment.opened
when payload.issue.body matches /^@probot label @(\w+)$/
then label($1)

# Close stale issues and pull requests
on *.labeled
when labeled("needs-work") and state("open")
then delay(7 days) and close

# Tweet when a new release is created
on release.published
then tweet("Get it while it's hot! {{ repository.name }} {{ release.name }} was just released! {{ release.html_url }}")

# Assign a reviewer issues or pull requests with a label
on issues.opened and pull_request.opened and issues.labeled and pull_request.labeled
when labeled(security)
then assign(random(members(security-first-responders));

# Label state transitions
# TODO

# Apply label based on changed files
# TODO
```