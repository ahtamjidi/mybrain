- [Font size control of LateX previews in Org files](https://emacs.stackexchange.com/questions/19880/font-size-control-of-latex-previews-in-org-files)
- [An Annotated Spacemacs](https://out-of-cheese-error.netlify.app/spacemacs-config "Permalink to An Annotated Spacemacs")
- [**Strange problem loading org features in Emacs 27.1**](https://orgmode.org/list/CAJ51EToGbas5EfN03C-bd-Ws46X-ED37mMU3tdbuLh41f9N1hQ@mail.gmail.com/T/)
- [Absolute Beginner's Guide to Emacs](http://www.jesshamrick.com/2012/09/10/absolute-beginners-guide-to-emacs/)
- In order to have org-drill and latex preview in org mode I installed doom emacs distribution and enabled latex and bunch of other packages in the `~/.doom/initi.el` file and then installed `org-drill` and `org-fragtog-mode` by adding the following lines to `~/.doom/pakcage.el`
```lisp
    (package! org-drill)
   (use-package! org-drill
      :after org)
     
    ;; to install a package directly from a remote git repo, you must specify a
    ;; `:recipe'. you'll find documentation on what `:recipe' accepts here:
    ;; https://github.com/raxod502/straight.el#the-recipe-format
    (package! org-fragtog-mode
      :recipe (:host github :repo "io12/org-fragtog"))
    (use-package! org-fragtog-mode
      :after org)
```
Then added the following to `~/.doom/config.el`

```lisp
use-package org-drill
   :defer t
   :ensure org-plus-contrib
   :commands (org-drill)
   :config
   ;; Config options
   )

    (add-hook 'org-mode-hook 'org-fragtog-mode)
```
and then ran `~/.emacs.d/bin/doom sync` in the terminal and for changing the default font size for latex formulas when in an org file I did `Ctrl + v h` and then typed `org-format-latex-options` and change the scale to your liking (watch [this video](https://sachachua.com/blog/2014/04/emacs-basics-customizing-emacs/) if for an alternative way of changing the scale option specially if you have no idea what is happening.)

This [blog post](https://rgoswami.me/posts/anki-decks-orgmode/) explains how to use emacs with [anki](https://apps.ankiweb.net/).


## How to create Anki cards in org mode
[This article](https://yiufung.net/post/anki-org/) has all the steps to create a card that has code and latex formula I specially liked the fact that I can create beautiful source code cards like
![[Pasted image 20210122235600.png]]
There was a typo in the [anki-cards.el](https://yiufung.net/ox-hugo/anki-cards.el) file.  A ` ' ` was missing before **a** and **A** so the correct form is 

```emacs-lisp
'("a" "Anki basic"
```
and 
```emacs-lisp
'("A" "Anki cloze"
```

Also for taking screenshots I installed org-download and added the following to `.doom.d/config.el`

```emacs-lisp
(require 'org-download)

;; Drag-and-drop to \`dired\`
(add-hook 'dired-mode-hook 'org-download-enable)
```

It took me sometime to realize that I have to enable `anki-editor-mode` so that the images get properly copied into Anki.

>Double check that you've enabled `anki-editor-mode` before trying to push. I think it's a bit confusing but enabling the mode wraps some exports with advice functions which properly handle image links. ([source](https://github.com/louietan/anki-editor/issues/30))

### Writing blog from org mode
Tools are [here](https://orgmode.org/worg/org-blog-wiki.html) and apparently Hugo supports 

## Engineering notebook
[Capturing Content for Emacs](http://howardism.org/Technical/Emacs/capturing-content.html): Very interesting ideas on how to capture code and web content when you are working on a project.	

## OCR inside emacs
https://askubuntu.com/questions/280475/how-can-instantaneously-extract-text-from-a-screen-area-using-ocr-tools

## Scratch pad
https://lobste.rs/s/e5lx5p/what_note_taking_team_wiki_personal_wiki

## learn elisp
https://www.youtube.com/playlist?list=PL3kg5TcOuFlpyqiZspzlkk6Ro66nQdESz

## [Resources](https://emacs.sexy/#resources)

Emacs is used by very happy hackers all around the globe. Lots of them are willing to help you get started or share the path they've walked along Emacs with you. It's dangerous to go alone; take this:

-   [The Emacs Manual](http://www.gnu.org/software/emacs/manual/html_node/emacs/index.html "The Emacs Manual") — Official GNU Emacs manual. See more manuals [here](http://www.gnu.org/software/emacs/manual/).
-   [Emacs Wiki](http://www.emacswiki.org/ "EmacsWiki") — a collection of useful information regarding Emacs and Emacs Lisp, its extension language.
-   [Planet Emacsen](https://planet.emacslife.com/ "Planet Emacsen") — An Emacs planet collecting posts from many Emacs blogs.
-   [Mastering Emacs](http://www.masteringemacs.org/ "Mastering
    Emacs") — A blog about mastering the world's best text editor.
-   [Emacs Rocks](http://emacsrocks.com/ "Emacs Rocks") — a series of videos teaching about Emacs. Includes a series on extending it.
-   [What the .emacs.d!?](http://whattheemacsd.com/ "What the
    .emacs.d!?") — Blog from the same author as Emacs Rocks, about setting up your .emacs.d.
-   [Using Emacs Series](https://cestlaz.github.io/stories/emacs/ "Using Emacs Series") — Tutorial screencasts for Emacs.
-   [Awesome Emacs](https://github.com/emacs-tw/awesome-emacs "Awesome Emacs") — A community driven list of useful Emacs packages, libraries and others.
-   [/r/emacs](http://reddit.com/r/emacs "Emacs Subreddit") — Reddit is a virtual community of (generally) very nice people. You can create an account there and share your questions, progress and snippets about Emacs on the Emacs subreddit.
-   [Emacs StackExchange](http://emacs.stackexchange.com/ "Emacs Stackexchange") — Q&A site for those using, extending or developing emacs.
-   [Spacemacs](https://github.com/syl20bnr/spacemacs#introduction) — An Emacs distribution, uses Evil Mode to combine the ergonomic editing features of Vim with the extensibility of Emacs.
-   [Doom Emacs](https://github.com/hlissner/doom-emacs) — Minimalistic modern Emacs distribution that is light and fast.
-   [Emacs Bootstrap](http://www.emacs-bootstrap.com/) — Generate on-the-fly Emacs development environment. It lets you select the programming languages you work with and generates enough Emacs config files to get you started.