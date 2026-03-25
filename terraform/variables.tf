variable "aws_region" {
  default = "ap-south-2"
}

variable "master_instance_type" {
  default = "t3.micro" # Bypassing kubeadm preflights for Free Tier
}

variable "worker_instance_type" {
  default = "t3.micro"
}

variable "worker_count" {
  default = 2
}

variable "key_name" {
  description = "Name of the AWS key pair"
  type        = string
  default     = "expt1-key"
}
