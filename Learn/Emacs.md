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