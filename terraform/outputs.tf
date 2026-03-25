output "master_public_ip" {
  value = aws_instance.k8s_master.public_ip
  description = "Public IP of the Kubernetes Master Node"
}

output "worker_public_ips" {
  value = aws_instance.k8s_worker[*].public_ip
  description = "Public IPs of the Kubernetes Worker Nodes"
}
