variable "aws_region" {
  default = "ap-south-2"
}

variable "master_instance_type" {
  default = "t3.small"
}

variable "worker_instance_type" {
  default = "t3.small"
}

variable "worker_count" {
  default = 2
}

variable "key_name" {
  description = "Name of the AWS key pair"
  type        = string
  default     = "expt1-key"
}
