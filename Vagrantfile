Vagrant.configure("2") do |config|
  config.vm.box = "debian/buster64"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
  end
  # Run Ansible from the Vagrant VM
  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "playbook.yml"
  end
end
