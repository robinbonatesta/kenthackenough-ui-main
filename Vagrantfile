# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  # Sync folder
  config.vm.synced_folder "./", "/var/www/kenthackenough-ui-main"

  # Forward port 3000
  config.vm.network "forwarded_port", guest: 80, host: 3000

  # Provision
  config.vm.provision "shell", path: "provision.sh"

end
