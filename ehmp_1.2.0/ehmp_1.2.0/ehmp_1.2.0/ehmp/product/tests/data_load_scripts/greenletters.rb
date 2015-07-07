require 'greenletters'

console = Greenletters::Process.new("ssh vagrant@10.2.2.101",:transcript => $stdout, :timeout => 10)

console.start!

console.wait_for(:output, /vagrant@10.2.2.101's password: /i)
console << "vagrant\r"

console.wait_for(:output, /[vagrant@localhost ~]$/i)
console << "sudo csession cache -U VISTA\r"

console.wait_for(:output, /VISTA>/i)
console << "D ^XUP\r"

console.wait_for(:output, /Access Code: /i)
console << "pha1234\r"

console.wait_for(:output, /Select OPTION NAME:/i)
console << "rx\r"

console.wait_for(:output, /CHOOSE 1-4:/i)
console << "2\r"

console.wait_for(:output, /Division: /i)
console << "500\r"
console << "\r"
console << "\r"
console << "\r"
console << "\r"
console << "\r"
console << "\r"
console << "\r"

console.wait_for(:output, /Patient Prescription Processing/i)
console << "Patient Prescription Processing\r"

console.wait_for(:output, /Select PATIENT NAME:/i)
console << "DIABETIC\r"
console << "\r"
console << "\r"
console << "\r"
console << "\r"



order_number = 1

until order_number > 9
	console.wait_for(:output, /Select Action: Next Screen/i)
	console << "so\r"

	console.wait_for(:output, /Select Orders by number:/i)
	console << "#{order_number}\r"

	console.wait_for(:output, /FINISH/i)
	console << "fn\r"
	console << "\r"

	console.wait_for(:output, /Copy Provider Comments into the Patient Instructions?/i)
	console << "\r"

	console.wait_for(:output, /Do you want to Continue?/i)
	console << "yes\r"

	console.wait_for(:output, /PROVIDER:/i)
	console << "PROVIDER,EIGHT\r"

	console.wait_for(:output, /CHOOSE 1-5:/i)
	console << "1\r"

	console.wait_for(:output, /RECOMMENDATION:/i)
	console << "8\r"

	console.wait_for(:output, /Would you like to edit this intervention/i)
	console << "\r"

	console.wait_for(:output, /Was treatment for Service Connected condition?/i)
	console << "no\r"

	console.wait_for(:output, /Are you sure you want to Accept this Order?/i)
	console << "yes\r"

	console.wait_for(:output, /METHOD OF PICK-UP:/i)
	console << "\r"

	console.wait_for(:output, /WAS THE PATIENT COUNSELED/i)
	console << "\r"
	console << "\r"
	console << "\r"

	order_number += 1
end


console.wait_for(:output)
console.wait_for(:exit)






