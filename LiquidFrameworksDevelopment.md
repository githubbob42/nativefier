[![Nativefier](http://www.liquidframeworks.com/sites/default/files/LiqFra_header_logo.png)](http://www.liquidframeworks.com/)

# Nativefier

A third party application/project we use (and modify) to build the alpine-desktop project (FieldFX Mobile Desktop Client).

We need to get the latest version and rebuild it against our changes in a separate branch.

We typically only need to do this when the version of Electron (and hopefully Chromium) is updated in Nativefier or if we have any internal/proprietary code changes that need to be made.

You can check the following for updates:
* https://github.com/jiahaog/nativefier/blob/master/docs/changelog.md
* https://electronjs.org/releases/stable

Search for `Chrome` or `Chromium` (or just `Chrom`) for updates to what version of Electron and/or Chrome/Chromium are being used.


## Getting Started
You typically only need to do this once...

#### Setup project environment
Fork from https://github.com/LiquidFrameworks/nativefier.git into your GitHub repository.

Then clone to your local dev environment:
```term
cd projects (or whatever)
git clone https://github.com/<your-repo>/nativefier.git
cd nativefier
git remote add upstream https://github.com/LiquidFrameworks/nativefier.git
git remote add jiahaog https://github.com/jiahaog/nativefier.git
```

Note that our (LiquidFrameworks) repo is forked from https://github.com/jiahaog/nativefier.git.  We need to pull

Next run `fetch` so you have a reference to the `LiquidFrameworks` branch where we keep/make all of our internal customizations (About... dialog, userAgent, etc):
```term
git fetch upstream
git checkout LiquidFrameworks
```

**NOTE**: If you need to make any modifications to the main `natifivefier` code base, branch from `master` and make your changes and pull request from there.  That way we don't expose any of our internal customizations.  (Don't include `lib/` folders in PRs to `jihaog/nativefier`)


#### Dev Up

```term
$ npm run dev-up
```

(if on Windows)

```term
$ npm run dev-up-win
```

or you can do it manually...

```term
$ cd app
$ npm install
$ cd ..
$ npm install
```


## Update the project
This is the part that needs to done every time we update the windows client.  We typically only need to do this when the version of Electron (and hopefully Chromium) is updated in Nativefier or if we have any internal/proprietary code changes that need to be made.

You can check the following for updates:
* https://github.com/jiahaog/nativefier/blob/master/docs/changelog.md
* https://electronjs.org/releases/stable

Search for `Chrome` or `Chromium` (or just `Chrom`) for updates to what version of Electron and/or Chrome/Chromium are being used.

#### Get latest and rebase against master

Get the latest Natifivefier from the source repo...

```term
cd nativefier
git checkout master
git pull jiahaog master
```

Update `upstream` and `origin` (for `upstream` you will need write permissions for the https://github.com/LiquidFrameworks/nativefier.git repo)
```term
git push upstream master
git push origin master
```

Next `rebase` the `LiquidFrameworks` branch against `master`

```term
git checkout LiquidFrameworks
git rebase master
```

Install Dependencies, if necessary

```term
$ npm install
```

### Make code changes
(if necessary)


### Build

```term
npm run build
```

### Commiting changes

It's probably not necessary, but I try to commit my code changes separate from the build output (`lib` file/folder changes).  I think it had to do with submitting pull requests back into main `jiahaog` repo originally but mainly it makes for cleaner code commits.

1) Add files from `src` and `app/src` folder(s)
   *  ` git add src`
   *  ` git add app/src`
1) commit changes
   * `git commit -m "<what-did-you-do>"`
1) Add files from `lib` and `app/lib` folder(s)
   *  ` git add lib`
   *  ` git add app/lib`
1) commit lib files
   * `git commit -m "updated lib files"`

We commit the `lib` files/folders so Nativefier works in the `alpine-desktop` project.


### Push up you YOUR repo

```term
git push origin LiquidFrameworks
```

The branch is referenced in the `package.json` file in the `alpine-desktop` project used to build the FieldFX Mobile Desktop Client.



© 2019 LiquidFrameworks, Inc. All rights reserved.
