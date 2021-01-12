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