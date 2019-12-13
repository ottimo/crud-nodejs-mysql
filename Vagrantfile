Vagrant.configure("2") do |config|
  config.vm.box = "debian/buster64"
  config.vm.hostname = "crud-nodejs-mysql.box"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
    vb.customize [
      "modifyvm", :id,
      "--cpuexecutioncap", "50",
      "--vram", "16",
    ]
  end

  # Run Ansible from the Vagrant VM
  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "playbook.yml"
  end
end
