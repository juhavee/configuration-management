# automatic set user only works if the minion has only one user. of there's multiple users
# it chooses the first one alphabetically.  if minion has more than one user
# you can replace "salt.cmd.run('ls /home')" with a username that's being used on the minion
# for example: {% set user = 'xubuntu' %} 
{% set user = salt.cmd.run('ls /home') %}

curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg:
  cmd.run
install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/:
  cmd.run
sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list':
  cmd.run

apt-transport-https:
  pkg.installed
sudo apt update:
  cmd.run
code:
  pkg.installed

/home/{{ user }}/.vscode/extensions:
  file.recurse:
  - user: {{ user }}
  - file_mode: 744
  - dir_mode: 755  
  - source: salt://vscode/extensions
