# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  # Sync folder
  config.vm.synced_folder "./", "/var/www/kenthackenough-ui-main"

  # Forward port 3001
  config.vm.network "forwarded_port", guest: 80, host: 3002
  config.vm.network "forwarded_port", guest: 22, host: 2424, id: "ssh"

  # Provision
  config.vm.provision "shell", path: "provision.sh" do |s|
    s.args = ["dev"]
  end

  # Make symlinks work on Windows
  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

end
