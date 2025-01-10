up_l1:
	cd lab1 && pulumi up

down_l1:
	pulumi destroy 

stack_rm:
	pulumi stack rm