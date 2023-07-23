module.exports = {
   git: {
      // https://ec.europa.eu/component-library/v1.15.0/eu/docs/conventions/git/#type
      // chore: Changes to the build process or auxiliary tools and
      // libraries such as documentation generation.
      // Compliant with @release-it/conventional-changelog
      commitMessage: 'chore: release v${version}',

      // By default, release-it does not check the number of commits
      // upfront to prevent "empty" releases. Configure
      // "git.requireCommits": true to exit the release-it process
      // if there are no commits since the latest tag.

      requireCommits: true,
   },

   github: {
      // https://github.com/release-it/release-it/blob/HEAD/docs/github-releases.md
      // To automate the release (using the GitHub REST API), the
      // following needs to be configured:
      // Configure github.release: true
      // Obtain a personal access token(release- it only needs "repo"
      // access; no "admin" or other scopes).
      // Make sure the token is available as an environment variable.
      release: true,
   },

   plugins: {
      // https://github.com/release-it/conventional-changelog
      // Use this plugin to get the recommended bump based on
      // the commit messages.
      // Additionally, it can generate a conventional changelog,
      // and optionally update the CHANGELOG.md file in the process.
      '@release-it/conventional-changelog': {
         infile: 'CHANGELOG.md',
         header: '# Changelog',
         preset: {
            name: 'conventionalcommits',

            // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md#types
            // https://ec.europa.eu/component-library/v1.15.0/eu/docs/conventions/git/#type
            types: [
               {
                  type: 'feat',
                  section: 'Features',
               },
               {
                  type: 'fix',
                  section: 'Bug Fixes',
               },
               {
                  type: 'docs',
                  section: 'Docs',
                  hidden: false,
               },
            ],
         },
      },
   },
};
