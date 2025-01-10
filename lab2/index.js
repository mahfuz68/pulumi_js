const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");

// Create a VPC
const vpc = new aws.ec2.Vpc("my-vpc", {
    cidrBlock: "10.0.0.0/16",
    tags: {
        Name: "my-vpc"
    }
});

exports.vpcId = vpc.id;

// Create a public subnet
const publicSubnet = new aws.ec2.Subnet("public-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "ap-southeast-1a",
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "my-public-subnet"
    }
});

exports.publicSubnetId = publicSubnet.id;

// Create a private subnet
const privateSubnet = new aws.ec2.Subnet("private-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.2.0/24",
    availabilityZone: "ap-southeast-1a",
    tags: {
        Name: "my-private-subnet"
    }
});

exports.privateSubnetId = privateSubnet.id;


// Create a private subnet
// const privateSubnet = new aws.ec2.Subnet("private-subnet", {
//     vpcId: vpc.id,
//     cidrBlock: "10.0.2.0/24",
//     availabilityZone: "ap-southeast-1a",
//     tags: {
//         Name: "my-private-subnet"
//     }
// });

exports.privateSubnetId = privateSubnet.id;

// Create an Internet Gateway
const igw = new aws.ec2.InternetGateway("internet-gateway", {
    vpcId: vpc.id,
    tags: {
        Name: "my-internet-gateway"
    }
});

exports.igwId = igw.id;

// Create a route table for the public subnet
const publicRouteTable = new aws.ec2.RouteTable("public-route-table", {
    vpcId: vpc.id,
    tags: {
        Name: "my-public-route-table"
    }
});

// Create a route in the route table for the Internet Gateway
const route = new aws.ec2.Route("igw-route", {
    routeTableId: publicRouteTable.id,
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: igw.id,
});

// Associate the route table with the public subnet
const routeTableAssociation = new aws.ec2.RouteTableAssociation("public-route-table-association", {
    subnetId: publicSubnet.id,
    routeTableId: publicRouteTable.id,
});

exports.publicRouteTableId = publicRouteTable.id;

// Allocate an Elastic IP for the NAT Gateway
const eip = new aws.ec2.Eip("nat-eip", {
    vpc: true,
});

// Create the NAT Gateway
const natGateway = new aws.ec2.NatGateway("nat-gateway", {
    subnetId: publicSubnet.id,
    allocationId: eip.id,
    tags: {
        Name: "my-nat-gateway"
    }
});

exports.natGatewayId = natGateway.id;

// Create a route table for the private subnet
const privateRouteTable = new aws.ec2.RouteTable("private-route-table", {
    vpcId: vpc.id,
    tags: {
        Name: "my-private-route-table"
    }
});

// Create a route in the route table for the NAT Gateway
const privateRoute = new aws.ec2.Route("nat-route", {
    routeTableId: privateRouteTable.id,
    destinationCidrBlock: "0.0.0.0/0",
    natGatewayId: natGateway.id,
});

// Associate the route table with the private subnet
const privateRouteTableAssociation = new aws.ec2.RouteTableAssociation("private-route-table-association", {
    subnetId: privateSubnet.id,
    routeTableId: privateRouteTable.id,
});

exports.privateRouteTableId = privateRouteTable.id;

