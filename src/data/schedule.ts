import type { DayEntry } from '../types'

export const SCHEDULE: DayEntry[] = [
  // ────────────────────────────────────────────────────────────
  // WEEK A
  // ────────────────────────────────────────────────────────────
  {
    dayNumber: 1,
    topicId: 'kubernetes',
    title: 'Kubernetes: Core Architecture & Objects',
    weekInRotation: 1,
    dayInRotation: 1,
    theoryReading: [
      { title: 'Kubernetes Components', url: 'https://kubernetes.io/docs/concepts/overview/components/', type: 'docs' },
      { title: 'Understanding Kubernetes Objects', url: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/', type: 'docs' },
      { title: 'The Illustrated Children\'s Guide to Kubernetes', url: 'https://www.youtube.com/watch?v=4ht22ReBjno', type: 'video' },
    ],
    exercise: {
      description: 'Deploy a simple nginx Pod and expose it via a ClusterIP Service. Then access it using port-forward.',
      steps: [
        'Write a Pod manifest: image nginx:alpine, label app=nginx',
        'Write a Service manifest: ClusterIP, port 80, selector app=nginx',
        'Apply both: kubectl apply -f pod.yaml -f svc.yaml',
        'Port-forward: kubectl port-forward svc/nginx-svc 8080:80',
        'Curl localhost:8080 and confirm 200 OK',
        'Describe the pod: kubectl describe pod nginx and read the Events section',
      ],
      answerHint: 'The Service selector must exactly match the Pod label key/value.',
      answer: `Pod manifest:
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
\`\`\`

Service manifest:
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
\`\`\`

Key insight: ClusterIP Services are only reachable inside the cluster. kubectl port-forward tunnels through the API server directly to the pod — it bypasses the CNI entirely, which is why it works even without a working network policy.`,
    },
  },
  {
    dayNumber: 2,
    topicId: 'golang',
    title: 'Go: Types, Functions & the Standard Library',
    weekInRotation: 1,
    dayInRotation: 2,
    theoryReading: [
      { title: 'A Tour of Go — Basics', url: 'https://go.dev/tour/basics/1', type: 'docs' },
      { title: 'Effective Go', url: 'https://go.dev/doc/effective_go', type: 'docs' },
      { title: 'Go in 100 Seconds', url: 'https://www.youtube.com/watch?v=446E-r0rXHI', type: 'video' },
    ],
    exercise: {
      description: 'Write a Go CLI tool that reads a filename from args and prints the number of lines, words, and bytes — similar to wc.',
      steps: [
        'Create main.go with package main and func main()',
        'Use os.Args[1] to get the filename argument',
        'Open the file with os.Open and handle the error',
        'Use bufio.Scanner to read lines and count them',
        'Count words by splitting each line with strings.Fields()',
        'Print results in format: lines=N words=N bytes=N',
        'Test with: go run main.go /etc/hosts',
      ],
      answerHint: 'bufio.Scanner reads line-by-line; strings.Fields splits on any whitespace.',
      answer: `\`\`\`go
package main

import (
  "bufio"
  "fmt"
  "os"
  "strings"
)

func main() {
  if len(os.Args) < 2 {
    fmt.Fprintln(os.Stderr, "usage: wc <file>")
    os.Exit(1)
  }

  f, err := os.Open(os.Args[1])
  if err != nil {
    fmt.Fprintln(os.Stderr, err)
    os.Exit(1)
  }
  defer f.Close()

  var lines, words, bytes int
  scanner := bufio.NewScanner(f)
  for scanner.Scan() {
    line := scanner.Text()
    lines++
    words += len(strings.Fields(line))
    bytes += len(scanner.Bytes()) + 1 // +1 for newline
  }

  fmt.Printf("lines=%d words=%d bytes=%d\\n", lines, words, bytes)
}
\`\`\`

Key Go patterns shown: os.Args, defer for cleanup, error handling with if err != nil, bufio.Scanner for line-by-line reading.`,
    },
  },
  {
    dayNumber: 3,
    topicId: 'terraform',
    title: 'Terraform: State, Providers & Resource Lifecycle',
    weekInRotation: 1,
    dayInRotation: 3,
    theoryReading: [
      { title: 'Terraform Language — Configuration Basics', url: 'https://developer.hashicorp.com/terraform/language', type: 'docs' },
      { title: 'How Terraform Works — Internals', url: 'https://developer.hashicorp.com/terraform/plugin/how-terraform-works', type: 'docs' },
      { title: 'Complete Terraform Course (FreeCodeCamp)', url: 'https://www.youtube.com/watch?v=7xngnjfIlK4', type: 'video' },
    ],
    exercise: {
      description: 'Write a Terraform config that provisions a local file using the hashicorp/local provider. Observe the state lifecycle.',
      steps: [
        'Create main.tf with terraform {} block and required_providers for local provider',
        'Add a resource "local_file" "hello" that writes "Hello DevOps" to hello.txt',
        'Run: terraform init',
        'Run: terraform plan — read the output carefully',
        'Run: terraform apply — confirm and observe terraform.tfstate',
        'Change the content and run terraform plan again — observe the diff',
        'Run: terraform destroy and check the file is gone',
      ],
      answerHint: 'The local provider is perfect for learning Terraform without cloud credentials.',
      answer: `\`\`\`hcl
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

resource "local_file" "hello" {
  content  = "Hello DevOps"
  filename = "\${path.module}/hello.txt"
}
\`\`\`

Key concepts:
- terraform.tfstate tracks real-world state. Never edit it manually.
- terraform plan computes the diff between state and config.
- The lifecycle: init → plan → apply → destroy.
- "~> 2.4" means >=2.4.0, <3.0.0 (pessimistic constraint).`,
    },
  },
  {
    dayNumber: 4,
    topicId: 'python',
    title: 'Python: Scripting, subprocess & pathlib',
    weekInRotation: 1,
    dayInRotation: 4,
    theoryReading: [
      { title: 'Python subprocess docs', url: 'https://docs.python.org/3/library/subprocess.html', type: 'docs' },
      { title: 'pathlib — Object-oriented filesystem paths', url: 'https://docs.python.org/3/library/pathlib.html', type: 'docs' },
      { title: 'Automate the Boring Stuff — Chapter 9 (Files)', url: 'https://automatetheboringstuff.com/2e/chapter9/', type: 'book' },
    ],
    exercise: {
      description: 'Write a Python script that checks if kubectl is installed, gets the current cluster context, and lists all namespaces with their pod counts.',
      steps: [
        'Import subprocess, sys, json',
        'Use subprocess.run(["which", "kubectl"], capture_output=True) to check if kubectl exists',
        'Exit with a clear error message if kubectl is not found',
        'Get current context: kubectl config current-context',
        'Get namespaces as JSON: kubectl get namespaces -o json',
        'For each namespace, get pod count: kubectl get pods -n <ns> --no-headers | wc -l',
        'Print a formatted table: namespace | pod count',
      ],
      answerHint: 'Use check=True on subprocess.run to automatically raise on non-zero exit codes.',
      answer: `\`\`\`python
import subprocess
import sys
import json

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True)

# Check kubectl
result = subprocess.run(["which", "kubectl"], capture_output=True)
if result.returncode != 0:
    print("Error: kubectl not found in PATH", file=sys.stderr)
    sys.exit(1)

# Current context
ctx = run(["kubectl", "config", "current-context"]).stdout.strip()
print(f"Cluster: {ctx}\\n")

# Namespaces
ns_json = json.loads(run(["kubectl", "get", "namespaces", "-o", "json"]).stdout)
namespaces = [item["metadata"]["name"] for item in ns_json["items"]]

print(f"{'NAMESPACE':<30} {'PODS':>6}")
print("-" * 38)
for ns in namespaces:
    pods = run(["kubectl", "get", "pods", "-n", ns, "--no-headers"]).stdout
    count = len([l for l in pods.strip().splitlines() if l])
    print(f"{ns:<30} {count:>6}")
\`\`\``,
    },
  },
  {
    dayNumber: 5,
    topicId: 'bash',
    title: 'Bash: Arrays, Functions & Error Handling',
    weekInRotation: 1,
    dayInRotation: 5,
    theoryReading: [
      { title: 'Bash Reference Manual — Arrays', url: 'https://www.gnu.org/software/bash/manual/bash.html#Arrays', type: 'docs' },
      { title: 'ShellCheck — static analysis for shell scripts', url: 'https://www.shellcheck.net/', type: 'github' },
      { title: 'The Art of the Command Line', url: 'https://github.com/jlevy/the-art-of-command-line', type: 'github' },
    ],
    exercise: {
      description: 'Write a Bash script that checks the health of multiple URLs and reports their status codes. Use arrays, functions, and proper error handling.',
      steps: [
        'Set -euo pipefail at the top (strict mode)',
        'Define an array of URLs to check',
        'Write a check_url() function that curls with -o /dev/null -s -w "%{http_code}" and returns the status code',
        'Loop over the array and call check_url() for each',
        'Color the output: green for 2xx, yellow for 3xx, red for 4xx/5xx',
        'Print a summary: N/M URLs healthy',
        'Exit with code 1 if any URL failed',
      ],
      answerHint: 'Use \\033[32m for green, \\033[31m for red, \\033[0m to reset. Check ${code:0:1} for the status class.',
      answer: `\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

URLS=(
  "https://kubernetes.io"
  "https://go.dev"
  "https://developer.hashicorp.com"
)

GREEN='\\033[32m'
YELLOW='\\033[33m'
RED='\\033[31m'
RESET='\\033[0m'

healthy=0
total=\${#URLS[@]}

check_url() {
  local url=$1
  curl -o /dev/null -s -w "%{http_code}" --max-time 10 "$url"
}

for url in "\${URLS[@]}"; do
  code=$(check_url "$url")
  class="\${code:0:1}"

  if [[ $class == "2" ]]; then
    echo -e "\${GREEN}✓ $code\${RESET}  $url"
    ((healthy++))
  elif [[ $class == "3" ]]; then
    echo -e "\${YELLOW}→ $code\${RESET}  $url"
    ((healthy++))
  else
    echo -e "\${RED}✗ $code\${RESET}  $url"
  fi
done

echo ""
echo "Summary: $healthy/$total URLs healthy"
[[ $healthy -eq $total ]]
\`\`\`

Key patterns: set -euo pipefail for strict mode, \${#array[@]} for length, \${var:0:1} for substring, (( )) for arithmetic.`,
    },
  },
  {
    dayNumber: 6,
    topicId: 'grafana',
    title: 'Grafana Stack: Architecture & Metrics with Mimir',
    weekInRotation: 1,
    dayInRotation: 6,
    theoryReading: [
      { title: 'Grafana Stack Overview', url: 'https://grafana.com/oss/', type: 'docs' },
      { title: 'Introduction to Grafana Mimir', url: 'https://grafana.com/docs/mimir/latest/get-started/', type: 'docs' },
      { title: 'Prometheus Data Model', url: 'https://prometheus.io/docs/concepts/data_model/', type: 'docs' },
    ],
    exercise: {
      description: 'Write a PromQL query that finds the top 5 pods by CPU usage in the last 5 minutes, and another that alerts if a namespace has zero running pods.',
      steps: [
        'Understand the metric: container_cpu_usage_seconds_total from cAdvisor',
        'Write: rate(container_cpu_usage_seconds_total[5m]) to get per-second CPU rate',
        'Add namespace and pod labels as filters',
        'Use topk(5, ...) to get the top 5',
        'For the alert query: count(kube_pod_status_phase{phase="Running"}) by (namespace) == 0',
        'Understand the difference between instant vector and range vector in PromQL',
      ],
      answerHint: 'rate() requires a range vector [5m]. topk takes the first argument as the count.',
      answer: `Top 5 pods by CPU (last 5m):
\`\`\`promql
topk(5,
  sum by (namespace, pod) (
    rate(container_cpu_usage_seconds_total{container!=""}[5m])
  )
)
\`\`\`

Alert: namespace with zero running pods:
\`\`\`promql
count(kube_pod_status_phase{phase="Running"}) by (namespace) == 0
\`\`\`

Key concepts:
- container_cpu_usage_seconds_total is a counter (always increasing) — use rate() to get per-second rate
- sum by (namespace, pod) aggregates across all containers in a pod
- container!="" excludes the pause/infra container
- The alert fires when a namespace exists in the metric but has 0 running pods`,
    },
  },
  {
    dayNumber: 7,
    topicId: 'kubernetes',
    title: 'Kubernetes: Review Day — Deployments & ReplicaSets',
    weekInRotation: 1,
    dayInRotation: 7,
    theoryReading: [
      { title: 'Deployments', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/', type: 'docs' },
      { title: 'ReplicaSets', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/', type: 'docs' },
    ],
    exercise: {
      description: 'Create a Deployment with 3 replicas, perform a rolling update, then rollback to the previous version.',
      steps: [
        'Create a Deployment with nginx:1.24, 3 replicas, strategy RollingUpdate maxUnavailable=1',
        'Verify: kubectl rollout status deployment/nginx',
        'Update the image: kubectl set image deployment/nginx nginx=nginx:1.25',
        'Watch the rollout: kubectl rollout status deployment/nginx',
        'Check rollout history: kubectl rollout history deployment/nginx',
        'Rollback: kubectl rollout undo deployment/nginx',
        'Verify pods are back on 1.24',
      ],
      answerHint: 'kubectl rollout history shows revisions. kubectl rollout undo --to-revision=N goes to a specific revision.',
      answer: `\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24
\`\`\`

Rollout commands:
\`\`\`bash
kubectl set image deployment/nginx nginx=nginx:1.25
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
kubectl rollout undo deployment/nginx
\`\`\`

A Deployment owns a ReplicaSet. When you update the image, a new ReplicaSet is created. The old one is kept (scaled to 0) for rollback purposes.`,
    },
  },
  // ────────────────────────────────────────────────────────────
  // WEEK B
  // ────────────────────────────────────────────────────────────
  {
    dayNumber: 8,
    topicId: 'argocd',
    title: 'ArgoCD: GitOps Principles & Application Sync',
    weekInRotation: 2,
    dayInRotation: 1,
    theoryReading: [
      { title: 'ArgoCD Getting Started', url: 'https://argo-cd.readthedocs.io/en/stable/getting_started/', type: 'docs' },
      { title: 'GitOps Principles', url: 'https://opengitops.dev/', type: 'article' },
      { title: 'ArgoCD Architecture', url: 'https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/', type: 'docs' },
    ],
    exercise: {
      description: 'Write an ArgoCD Application manifest that deploys a Helm chart from a public repo with automated sync and self-heal enabled.',
      steps: [
        'Create an Application manifest targeting the argocd namespace',
        'Set source to a public Helm chart repo (e.g. bitnami/nginx)',
        'Set destination to your cluster with a target namespace',
        'Enable automated sync with prune: true and selfHeal: true',
        'Add syncOptions: CreateNamespace=true',
        'Apply it and watch ArgoCD sync via the UI or argocd app get <name>',
        'Make a manual change to the deployed resource and watch self-heal revert it',
      ],
      answerHint: 'selfHeal means ArgoCD will revert any manual kubectl edits to match Git state.',
      answer: `\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx-demo
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://charts.bitnami.com/bitnami
    chart: nginx
    targetRevision: "18.1.7"
    helm:
      values: |
        replicaCount: 1
        service:
          type: ClusterIP
  destination:
    server: https://kubernetes.default.svc
    namespace: nginx-demo
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
\`\`\`

Key concepts:
- prune: true — ArgoCD deletes resources that exist in the cluster but not in Git
- selfHeal: true — ArgoCD re-applies Git state when someone manually edits a resource
- The Application resource is the declarative GitOps contract`,
    },
  },
  {
    dayNumber: 9,
    topicId: 'aws',
    title: 'AWS: IAM, VPC, and the Shared Responsibility Model',
    weekInRotation: 2,
    dayInRotation: 2,
    theoryReading: [
      { title: 'AWS IAM Best Practices', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', type: 'docs' },
      { title: 'VPC Overview', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html', type: 'docs' },
      { title: 'AWS Shared Responsibility Model', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/', type: 'article' },
    ],
    exercise: {
      description: 'Using Terraform, create a VPC with public and private subnets across 2 AZs, an Internet Gateway, and a NAT Gateway.',
      steps: [
        'Create a VPC with CIDR 10.0.0.0/16',
        'Create 2 public subnets: 10.0.1.0/24 and 10.0.2.0/24 in different AZs',
        'Create 2 private subnets: 10.0.10.0/24 and 10.0.11.0/24',
        'Attach an Internet Gateway to the VPC',
        'Create a NAT Gateway in one public subnet (allocate an Elastic IP first)',
        'Create route tables: public routes 0.0.0.0/0 to IGW, private routes to NAT GW',
        'Associate route tables with subnets',
      ],
      answerHint: 'NAT Gateway needs an Elastic IP allocation first. aws_eip + aws_nat_gateway are separate resources.',
      answer: `\`\`\`hcl
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "main" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}

resource "aws_eip" "nat" { domain = "vpc" }

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  depends_on    = [aws_internet_gateway.igw]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}
\`\`\`

Key insight: Public subnet = route to IGW. Private subnet = route to NAT GW. NAT GW allows private resources to reach the internet without being reachable from it.`,
    },
  },
  {
    dayNumber: 10,
    topicId: 'helm',
    title: 'Helm: Writing Charts, Templates & Values',
    weekInRotation: 2,
    dayInRotation: 3,
    theoryReading: [
      { title: 'Helm Chart Template Guide', url: 'https://helm.sh/docs/chart_template_guide/', type: 'docs' },
      { title: 'Built-in Objects', url: 'https://helm.sh/docs/chart_template_guide/builtin_objects/', type: 'docs' },
      { title: 'Helm Best Practices', url: 'https://helm.sh/docs/chart_best_practices/', type: 'docs' },
    ],
    exercise: {
      description: 'Write a Helm chart from scratch for a simple web app. It should support configurable replicas, image tag, and optional ingress via values.yaml.',
      steps: [
        'Run: helm create myapp — explore the generated structure',
        'Modify Chart.yaml: set name=myapp, appVersion=1.0.0',
        'Update values.yaml: image.repository=nginx, image.tag=alpine, replicaCount=2',
        'Edit templates/deployment.yaml to use .Values.image.repository and .Values.image.tag',
        'Make ingress conditional: {{- if .Values.ingress.enabled }}',
        'Run: helm template myapp . to render and inspect the YAML',
        'Run: helm install myapp . --dry-run to validate against a cluster',
      ],
      answerHint: 'helm template renders locally without a cluster. Use it to debug template issues.',
      answer: `Key Chart.yaml:
\`\`\`yaml
apiVersion: v2
name: myapp
version: 0.1.0
appVersion: "1.0.0"
\`\`\`

Key values.yaml:
\`\`\`yaml
image:
  repository: nginx
  tag: alpine
  pullPolicy: IfNotPresent
replicaCount: 2
ingress:
  enabled: false
  host: myapp.local
\`\`\`

Template pattern for image:
\`\`\`yaml
image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
\`\`\`

Conditional ingress:
\`\`\`yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
...
{{- end }}
\`\`\`

Key: .Release.Name, .Release.Namespace, .Values, .Chart are the 4 main built-in objects. Use toYaml | nindent N for multi-line values.`,
    },
  },
  {
    dayNumber: 11,
    topicId: 'cicd',
    title: 'CI/CD: GitHub Actions — Pipelines & Workflows',
    weekInRotation: 2,
    dayInRotation: 4,
    theoryReading: [
      { title: 'GitHub Actions — Understanding Workflows', url: 'https://docs.github.com/en/actions/writing-workflows/about-workflows', type: 'docs' },
      { title: 'Workflow Syntax Reference', url: 'https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions', type: 'docs' },
      { title: 'Reusable Workflows', url: 'https://docs.github.com/en/actions/sharing-automations/reusing-workflows', type: 'docs' },
    ],
    exercise: {
      description: 'Write a GitHub Actions workflow that: lints a Python script with ruff, runs tests with pytest, builds a Docker image, and pushes to GHCR on merge to main.',
      steps: [
        'Create .github/workflows/ci.yml',
        'Set on: push to main and pull_request to main',
        'Add a lint job: uses ubuntu-latest, installs ruff, runs ruff check .',
        'Add a test job that needs lint: installs pytest, runs pytest',
        'Add a build-and-push job that needs test, only on push to main',
        'Use docker/login-action@v3 with GHCR and GITHUB_TOKEN',
        'Use docker/build-push-action@v5 with cache-from/cache-to type=gha',
      ],
      answerHint: 'The needs: key creates job dependencies. if: github.event_name == "push" restricts to merge-only.',
      answer: `\`\`\`yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install ruff && ruff check .

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install pytest && pytest

  build-push:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\``,
    },
  },
  {
    dayNumber: 12,
    topicId: 'autoscaling',
    title: 'AutoScaling: HPA, VPA & KEDA',
    weekInRotation: 2,
    dayInRotation: 5,
    theoryReading: [
      { title: 'Horizontal Pod Autoscaler Walkthrough', url: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/', type: 'docs' },
      { title: 'KEDA — Event-driven Autoscaling', url: 'https://keda.sh/docs/latest/concepts/', type: 'docs' },
      { title: 'VPA Recommendation Mode', url: 'https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler', type: 'github' },
    ],
    exercise: {
      description: 'Write an HPA manifest that scales a deployment between 2 and 10 replicas based on CPU (target 50%) and memory (target 80%) utilization.',
      steps: [
        'Create a Deployment with resource requests: cpu=100m, memory=128Mi',
        'Create an HPA targeting the deployment',
        'Set minReplicas=2, maxReplicas=10',
        'Add CPU metric: targetAverageUtilization=50',
        'Add memory metric: targetAverageUtilization=80',
        'Apply and verify: kubectl get hpa -w',
        'Generate load with kubectl run load --image=busybox -it -- /bin/sh -c "while true; do wget -q -O- http://myapp/; done"',
      ],
      answerHint: 'Resource requests are required for CPU-based HPA. Without requests, the controller cannot compute utilization.',
      answer: `\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
\`\`\`

Key insight: HPA v2 (autoscaling/v2) supports multiple metrics and custom metrics. The controller checks every 15 seconds by default. Scale-down is more conservative — it waits 5 minutes of sustained under-utilization.

KEDA extends this with external metrics (Kafka lag, Redis queue length, Prometheus queries).`,
    },
  },
  {
    dayNumber: 13,
    topicId: 'ansible',
    title: 'Ansible: Playbooks, Roles & Idempotency',
    weekInRotation: 2,
    dayInRotation: 6,
    theoryReading: [
      { title: 'Ansible Getting Started', url: 'https://docs.ansible.com/ansible/latest/getting_started/index.html', type: 'docs' },
      { title: 'Ansible Best Practices', url: 'https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html', type: 'docs' },
      { title: 'Ansible Roles', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html', type: 'docs' },
    ],
    exercise: {
      description: 'Write an Ansible playbook that installs Docker on Ubuntu servers, ensures the service is started and enabled, and adds the ansible user to the docker group.',
      steps: [
        'Create inventory.ini with [webservers] group pointing to your test hosts',
        'Create playbook.yml: hosts: webservers, become: yes',
        'Add a task to install required packages: apt-transport-https, ca-certificates, curl',
        'Add Docker\'s GPG key and repository',
        'Install docker-ce using the apt module',
        'Use the service module to start and enable docker',
        'Use the user module to add the current user to the docker group',
        'Run: ansible-playbook -i inventory.ini playbook.yml --check (dry-run first)',
      ],
      answerHint: 'Use the apt module, not shell: apt-get install. Modules are idempotent; shell commands are not.',
      answer: `\`\`\`yaml
---
- name: Install Docker
  hosts: webservers
  become: yes

  tasks:
    - name: Install prerequisites
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg
        state: present
        update_cache: yes

    - name: Add Docker GPG key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker repository
      apt_repository:
        repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
        state: present

    - name: Install Docker CE
      apt:
        name: docker-ce
        state: present
        update_cache: yes

    - name: Start and enable Docker
      service:
        name: docker
        state: started
        enabled: yes

    - name: Add user to docker group
      user:
        name: "{{ ansible_user }}"
        groups: docker
        append: yes
\`\`\`

Key: state: present is idempotent — running this 10 times has the same result as running it once. Always prefer Ansible modules over shell tasks.`,
    },
  },
  {
    dayNumber: 14,
    topicId: 'git',
    title: 'Git: Internals, Rebasing & Advanced Workflows',
    weekInRotation: 2,
    dayInRotation: 7,
    theoryReading: [
      { title: 'Git Internals — Plumbing and Porcelain', url: 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain', type: 'book' },
      { title: 'Atlassian — Git Rebase', url: 'https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase', type: 'article' },
      { title: 'Oh Shit, Git!?!', url: 'https://ohshitgit.com/', type: 'article' },
    ],
    exercise: {
      description: 'Practice interactive rebase: squash 3 commits into 1, reword a commit message, and reorder commits.',
      steps: [
        'Create a test repo and make 4 commits with messages: "feat: add A", "fix: typo A", "feat: add B", "docs: readme"',
        'Run: git log --oneline to see the history',
        'Run: git rebase -i HEAD~4 to open the interactive editor',
        'Squash the "fix: typo A" into "feat: add A" using fixup',
        'Reword "docs: readme" to "docs: update README with B feature"',
        'Reorder so docs commit comes before feat: add B',
        'Run: git log --oneline again to verify the new history',
      ],
      answerHint: 'In the rebase editor: p=pick, r=reword, s=squash, f=fixup. Reorder by moving lines.',
      answer: `Interactive rebase editor for HEAD~4:
\`\`\`
pick abc1234 feat: add A
fixup abc1235 fix: typo A
reword abc1237 docs: readme
pick abc1236 feat: add B
\`\`\`
(moved docs above feat: add B, changed s→f and reordered lines)

After saving, Git will:
1. Apply "feat: add A" + absorb "fix: typo A" (no extra commit message)
2. Apply "docs: readme" and open editor to reword it
3. Apply "feat: add B"

Result: 3 clean commits instead of 4.

Key insight: Rebase rewrites history — use it only on local/unshared branches. Never rebase commits that others have pulled.

git reflog is your safety net: if you mess up a rebase, git reset --hard HEAD@{N} restores previous state.`,
    },
  },
  // ────────────────────────────────────────────────────────────
  // WEEK A (Cycle 2) — Days 15–21
  // ────────────────────────────────────────────────────────────
  {
    dayNumber: 15,
    topicId: 'kubernetes',
    title: 'Kubernetes: ConfigMaps, Secrets & Environment Injection',
    weekInRotation: 1,
    dayInRotation: 1,
    theoryReading: [
      { title: 'ConfigMaps', url: 'https://kubernetes.io/docs/concepts/configuration/configmap/', type: 'docs' },
      { title: 'Secrets', url: 'https://kubernetes.io/docs/concepts/configuration/secret/', type: 'docs' },
      { title: 'Inject Data Into Applications', url: 'https://kubernetes.io/docs/tasks/inject-data-application/', type: 'docs' },
    ],
    exercise: {
      description: 'Create a ConfigMap and a Secret, then inject them into a Pod as both env vars and mounted files.',
      steps: [
        'Create a ConfigMap with data: APP_ENV=production, LOG_LEVEL=info',
        'Create a Secret with data: DB_PASSWORD=supersecret (base64 encoded)',
        'Create a Pod that mounts the ConfigMap as env vars using envFrom',
        'Add the Secret value as a single env var using secretKeyRef',
        'Mount the ConfigMap as a volume at /etc/config/',
        'Exec into the pod: kubectl exec -it mypod -- sh',
        'Check env vars and the mounted file contents',
      ],
      answerHint: 'envFrom injects all ConfigMap keys as env vars. valueFrom.secretKeyRef injects a single key.',
      answer: `\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  LOG_LEVEL: info
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
stringData:        # stringData auto-base64-encodes
  DB_PASSWORD: supersecret
---
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: myapp
    image: busybox
    command: ["sleep", "3600"]
    envFrom:
    - configMapRef:
        name: app-config
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: DB_PASSWORD
    volumeMounts:
    - name: config-vol
      mountPath: /etc/config
  volumes:
  - name: config-vol
    configMap:
      name: app-config
\`\`\``,
    },
  },
  {
    dayNumber: 16,
    topicId: 'golang',
    title: 'Go: Goroutines, Channels & Concurrency Patterns',
    weekInRotation: 1,
    dayInRotation: 2,
    theoryReading: [
      { title: 'A Tour of Go — Concurrency', url: 'https://go.dev/tour/concurrency/1', type: 'docs' },
      { title: 'Go Concurrency Patterns (Rob Pike)', url: 'https://www.youtube.com/watch?v=f6kdp27TYZs', type: 'video' },
      { title: 'The Go Memory Model', url: 'https://go.dev/ref/mem', type: 'docs' },
    ],
    exercise: {
      description: 'Write a concurrent URL health checker that checks 10 URLs in parallel using goroutines and collects results via a channel.',
      steps: [
        'Define a Result struct: URL string, Code int, Err error',
        'Write a checkURL(url string, ch chan<- Result) function that sends to channel',
        'Launch each checkURL as a goroutine',
        'Create a buffered channel with capacity = len(urls)',
        'Collect all results by ranging N times from the channel',
        'Print results as they arrive',
        'Handle timeout with context.WithTimeout(ctx, 10*time.Second)',
      ],
      answerHint: 'A buffered channel with capacity = number of goroutines prevents deadlocks when goroutines finish before you read.',
      answer: `\`\`\`go
package main

import (
  "context"
  "fmt"
  "net/http"
  "time"
)

type Result struct {
  URL  string
  Code int
  Err  error
}

func checkURL(ctx context.Context, url string, ch chan<- Result) {
  req, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
  client := &http.Client{Timeout: 8 * time.Second}
  resp, err := client.Do(req)
  if err != nil {
    ch <- Result{URL: url, Err: err}
    return
  }
  defer resp.Body.Close()
  ch <- Result{URL: url, Code: resp.StatusCode}
}

func main() {
  urls := []string{
    "https://kubernetes.io",
    "https://go.dev",
    "https://github.com",
  }

  ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
  defer cancel()

  ch := make(chan Result, len(urls))
  for _, url := range urls {
    go checkURL(ctx, url, ch)
  }

  for range urls {
    r := <-ch
    if r.Err != nil {
      fmt.Printf("✗ %s — %v\\n", r.URL, r.Err)
    } else {
      fmt.Printf("✓ %d  %s\\n", r.Code, r.URL)
    }
  }
}
\`\`\``,
    },
  },
  {
    dayNumber: 17,
    topicId: 'terraform',
    title: 'Terraform: Modules, Locals & Remote State',
    weekInRotation: 1,
    dayInRotation: 3,
    theoryReading: [
      { title: 'Terraform Modules', url: 'https://developer.hashicorp.com/terraform/language/modules', type: 'docs' },
      { title: 'Remote State', url: 'https://developer.hashicorp.com/terraform/language/state/remote', type: 'docs' },
      { title: 'Terraform Registry — AWS VPC Module', url: 'https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest', type: 'docs' },
    ],
    exercise: {
      description: 'Refactor a flat Terraform config into a module. Extract a "server" module that takes name, instance_type, and subnet_id as variables.',
      steps: [
        'Create modules/server/main.tf with aws_instance resource',
        'Create modules/server/variables.tf with name, instance_type, subnet_id',
        'Create modules/server/outputs.tf outputting instance_id and private_ip',
        'In root main.tf, call module "web" { source = "./modules/server" name = "web" ... }',
        'Call it a second time for module "app"',
        'Run: terraform init (downloads module)',
        'Run: terraform plan — observe module.web.aws_instance.this naming',
      ],
      answerHint: 'Modules are referenced as module.<name>.<output_name>. Each call creates independent resources.',
      answer: `modules/server/variables.tf:
\`\`\`hcl
variable "name"          { type = string }
variable "instance_type" { type = string; default = "t3.micro" }
variable "subnet_id"     { type = string }
\`\`\`

modules/server/main.tf:
\`\`\`hcl
resource "aws_instance" "this" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  tags          = { Name = var.name }
}
\`\`\`

Root main.tf:
\`\`\`hcl
module "web" {
  source        = "./modules/server"
  name          = "web"
  instance_type = "t3.small"
  subnet_id     = aws_subnet.public[0].id
}

output "web_ip" {
  value = module.web.private_ip
}
\`\`\``,
    },
  },
  {
    dayNumber: 18,
    topicId: 'python',
    title: 'Python: FastAPI — Building Internal REST APIs',
    weekInRotation: 1,
    dayInRotation: 4,
    theoryReading: [
      { title: 'FastAPI Tutorial — First Steps', url: 'https://fastapi.tiangolo.com/tutorial/first-steps/', type: 'docs' },
      { title: 'FastAPI — Path Parameters & Query Params', url: 'https://fastapi.tiangolo.com/tutorial/path-params/', type: 'docs' },
      { title: 'Pydantic Models', url: 'https://docs.pydantic.dev/latest/', type: 'docs' },
    ],
    exercise: {
      description: 'Build a FastAPI app that exposes a /health endpoint, a /metrics endpoint returning fake stats, and a /exec endpoint that runs a safe whitelist of kubectl commands.',
      steps: [
        'Install: pip install fastapi uvicorn',
        'Create app.py with FastAPI() instance',
        'Add GET /health returning {"status": "ok", "timestamp": datetime.now().isoformat()}',
        'Add GET /metrics returning a dict of fake cluster metrics',
        'Add POST /exec with body {"command": "get pods"} — only allow whitelisted commands',
        'The whitelist: ["get pods", "get nodes", "get namespaces"]',
        'Run with: uvicorn app:app --reload and test via curl or the auto-generated /docs',
      ],
      answerHint: 'FastAPI auto-generates OpenAPI docs at /docs. Use Pydantic BaseModel for request body validation.',
      answer: `\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import subprocess

app = FastAPI()

WHITELIST = {"get pods", "get nodes", "get namespaces"}

class ExecRequest(BaseModel):
    command: str

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.get("/metrics")
def metrics():
    return {
        "pods_running": 42,
        "nodes_ready": 3,
        "cpu_usage_percent": 34.2,
        "memory_usage_percent": 61.5,
    }

@app.post("/exec")
def exec_kubectl(req: ExecRequest):
    if req.command not in WHITELIST:
        raise HTTPException(status_code=403, detail="Command not allowed")
    result = subprocess.run(
        ["kubectl"] + req.command.split(),
        capture_output=True, text=True, timeout=10
    )
    return {"output": result.stdout, "error": result.stderr}
\`\`\``,
    },
  },
  {
    dayNumber: 19,
    topicId: 'bash',
    title: 'Bash: Advanced Text Processing with awk, sed & jq',
    weekInRotation: 1,
    dayInRotation: 5,
    theoryReading: [
      { title: 'The AWK Programming Language', url: 'https://www.gnu.org/software/gawk/manual/gawk.html', type: 'docs' },
      { title: 'jq Manual', url: 'https://jqlang.github.io/jq/manual/', type: 'docs' },
      { title: 'sed — Stream Editor Tutorial', url: 'https://www.grymoire.com/Unix/Sed.html', type: 'article' },
    ],
    exercise: {
      description: 'Write three one-liners: (1) use awk to sum the memory column from kubectl top pods, (2) use jq to extract all image names from kubectl get pods -o json, (3) use sed to replace all occurrences of "staging" with "production" in a YAML file.',
      steps: [
        'For awk: kubectl top pods | awk "NR>1 {sum+=$3} END {print sum}" — skip header, sum column 3',
        'For jq: kubectl get pods -o json | jq -r ".items[].spec.containers[].image"',
        'For sed: sed -i "s/staging/production/g" config.yaml',
        'Combine them: get all images and pipe to sort | uniq -c | sort -rn for frequency',
        'Use awk to print only pods using more than 100Mi: kubectl top pods | awk "NR>1 && $3+0 > 100"',
      ],
      answerHint: 'jq -r outputs raw strings (no quotes). awk NR>1 skips the first line (header).',
      answer: `\`\`\`bash
# Sum memory usage across all pods (column 3 = memory in Mi)
kubectl top pods | awk 'NR>1 {gsub(/Mi/,"",$3); sum+=$3} END {print sum "Mi total"}'

# Extract all container images
kubectl get pods -o json | jq -r '.items[].spec.containers[].image' | sort -u

# Replace staging → production in YAML
sed -i 's/staging/production/g' config.yaml

# Pods using more than 100Mi (strip 'Mi' suffix for numeric comparison)
kubectl top pods | awk 'NR>1 {val=$3; gsub(/Mi/,"",val); if (val+0 > 100) print $1, $3}'

# Image frequency analysis
kubectl get pods -A -o json | \\
  jq -r '.items[].spec.containers[].image' | \\
  sort | uniq -c | sort -rn | head -10
\`\`\``,
    },
  },
  {
    dayNumber: 20,
    topicId: 'grafana',
    title: 'Grafana Stack: Loki Log Queries & Alerting',
    weekInRotation: 1,
    dayInRotation: 6,
    theoryReading: [
      { title: 'LogQL — Loki Query Language', url: 'https://grafana.com/docs/loki/latest/query/', type: 'docs' },
      { title: 'Grafana Alerting Overview', url: 'https://grafana.com/docs/grafana/latest/alerting/', type: 'docs' },
      { title: 'Loki Best Practices', url: 'https://grafana.com/docs/loki/latest/best-practices/', type: 'docs' },
    ],
    exercise: {
      description: 'Write LogQL queries: (1) count error log rate per namespace over 5m, (2) find slowest HTTP requests (>1s) from an nginx access log stream, (3) extract and count distinct error codes.',
      steps: [
        'Query 1: {namespace=~".+"} |= "error" | rate over 5m, sum by namespace',
        'Query 2: {app="nginx"} | logfmt | duration > 1s | line_format "{{.method}} {{.path}} {{.duration}}"',
        'Query 3: {app="myapp"} | json | error_code != "" | count_over_time by (error_code)',
        'Understand label vs line filters: {} selects streams, | filters within them',
        'Write a Grafana alert rule that fires when error rate > 10/min for 5 minutes',
      ],
      answerHint: 'LogQL has two query types: log queries (return log lines) and metric queries (return time series using rate/count_over_time).',
      answer: `Error rate per namespace (metric query):
\`\`\`logql
sum by (namespace) (
  rate({namespace=~".+"} |= "error" [5m])
)
\`\`\`

Slow nginx requests > 1s (log query with filter):
\`\`\`logql
{app="nginx"}
  | logfmt
  | request_time > 1
  | line_format "{{.method}} {{.request}} {{.request_time}}s"
\`\`\`

Count distinct error codes:
\`\`\`logql
sum by (error_code) (
  count_over_time(
    {app="myapp"} | json | error_code != "" [1m]
  )
)
\`\`\`

Alert rule (Grafana):
- Expression: last() > 10 on the error rate query
- For: 5m (must be above threshold for 5 minutes to fire)
- Labels: severity=critical`,
    },
  },
  {
    dayNumber: 21,
    topicId: 'kubernetes',
    title: 'Kubernetes: RBAC — Roles, Bindings & Service Accounts',
    weekInRotation: 1,
    dayInRotation: 7,
    theoryReading: [
      { title: 'RBAC Authorization', url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/', type: 'docs' },
      { title: 'Using RBAC Authorization — Best Practices', url: 'https://kubernetes.io/docs/concepts/security/rbac-good-practices/', type: 'docs' },
    ],
    exercise: {
      description: 'Create a ServiceAccount, Role, and RoleBinding that grants a pod read-only access to pods and services in one namespace only.',
      steps: [
        'Create a ServiceAccount named pod-reader in the staging namespace',
        'Create a Role pod-reader-role with get/list/watch on pods and services',
        'Create a RoleBinding binding the ServiceAccount to the Role',
        'Create a test pod using the ServiceAccount',
        'Exec into the pod and test: kubectl get pods (should work)',
        'Test: kubectl get pods -n production (should be forbidden — wrong namespace)',
        'Test: kubectl delete pod test (should be forbidden — no delete permission)',
      ],
      answerHint: 'Role is namespace-scoped. ClusterRole is cluster-wide. RoleBinding binds to a specific namespace.',
      answer: `\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-reader
  namespace: staging
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader-role
  namespace: staging
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader-binding
  namespace: staging
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-reader-role
subjects:
- kind: ServiceAccount
  name: pod-reader
  namespace: staging
---
apiVersion: v1
kind: Pod
metadata:
  name: rbac-test
  namespace: staging
spec:
  serviceAccountName: pod-reader
  containers:
  - name: kubectl
    image: bitnami/kubectl
    command: ["sleep", "3600"]
\`\`\``,
    },
  },
  // ────────────────────────────────────────────────────────────
  // WEEK B (Cycle 2) — Days 22–28
  // ────────────────────────────────────────────────────────────
  {
    dayNumber: 22,
    topicId: 'argocd',
    title: 'Argo Workflows: DAG Pipelines & Templates',
    weekInRotation: 2,
    dayInRotation: 1,
    theoryReading: [
      { title: 'Argo Workflows Core Concepts', url: 'https://argo-workflows.readthedocs.io/en/latest/workflow-concepts/', type: 'docs' },
      { title: 'DAG Templates', url: 'https://argo-workflows.readthedocs.io/en/latest/dag/', type: 'docs' },
      { title: 'Argo Workflows Examples', url: 'https://github.com/argoproj/argo-workflows/tree/main/examples', type: 'github' },
    ],
    exercise: {
      description: 'Write an Argo Workflow that runs a 3-step pipeline: (1) generate data, (2) two parallel processing steps, (3) merge results. Use DAG template.',
      steps: [
        'Create a Workflow with entrypoint: pipeline',
        'Define a DAG template with tasks: generate → [process-a, process-b] → merge',
        'process-a and process-b both depend on generate',
        'merge depends on process-a and process-b',
        'Each task runs a simple echo container',
        'Pass the output of generate as a parameter to process-a and process-b using outputs.result',
        'Submit: argo submit workflow.yaml --watch',
      ],
      answerHint: 'dependencies: [] in DAG tasks defines the execution order. Both tasks in a [] list run in parallel.',
      answer: `\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: pipeline-
spec:
  entrypoint: pipeline

  templates:
  - name: pipeline
    dag:
      tasks:
      - name: generate
        template: echo
        arguments:
          parameters: [{name: msg, value: "data-ready"}]

      - name: process-a
        depends: generate
        template: echo
        arguments:
          parameters: [{name: msg, value: "processing-A"}]

      - name: process-b
        depends: generate
        template: echo
        arguments:
          parameters: [{name: msg, value: "processing-B"}]

      - name: merge
        depends: process-a && process-b
        template: echo
        arguments:
          parameters: [{name: msg, value: "merged"}]

  - name: echo
    inputs:
      parameters:
      - name: msg
    container:
      image: alpine
      command: [echo]
      args: ["{{inputs.parameters.msg}}"]
\`\`\``,
    },
  },
  {
    dayNumber: 23,
    topicId: 'aws',
    title: 'AWS: EKS — Managed Kubernetes on AWS',
    weekInRotation: 2,
    dayInRotation: 2,
    theoryReading: [
      { title: 'Amazon EKS User Guide', url: 'https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html', type: 'docs' },
      { title: 'EKS Blueprints for Terraform', url: 'https://aws-ia.github.io/terraform-aws-eks-blueprints/', type: 'docs' },
      { title: 'IAM Roles for Service Accounts (IRSA)', url: 'https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html', type: 'docs' },
    ],
    exercise: {
      description: 'Write Terraform that provisions an EKS cluster using the terraform-aws-modules/eks module with one managed node group.',
      steps: [
        'Use module "eks" { source = "terraform-aws-modules/eks/aws" version = "~> 20.0" }',
        'Set cluster_name, kubernetes_version = "1.31"',
        'Pass vpc_id and subnet_ids from your VPC module',
        'Define one managed node group: instance_types = ["t3.medium"], min_size=1, max_size=3, desired_size=2',
        'Enable cluster endpoint public access',
        'Run: terraform plan and review the resources it would create',
        'Understand IRSA: how Kubernetes ServiceAccounts map to IAM roles via OIDC',
      ],
      answerHint: 'The EKS module creates the control plane, node groups, security groups, and OIDC provider automatically.',
      answer: `\`\`\`hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "my-cluster"
  cluster_version = "1.31"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    main = {
      instance_types = ["t3.medium"]
      min_size       = 1
      max_size       = 3
      desired_size   = 2
    }
  }

  # Enable IRSA
  enable_irsa = true
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "oidc_provider_arn" {
  value = module.eks.oidc_provider_arn
}
\`\`\`

IRSA pattern: pod's ServiceAccount → OIDC trust relationship → IAM Role. Eliminates storing AWS credentials in pods.`,
    },
  },
  {
    dayNumber: 24,
    topicId: 'helm',
    title: 'Helm: Hooks, Tests & Chart Dependencies',
    weekInRotation: 2,
    dayInRotation: 3,
    theoryReading: [
      { title: 'Helm Hooks', url: 'https://helm.sh/docs/topics/charts_hooks/', type: 'docs' },
      { title: 'Helm Chart Tests', url: 'https://helm.sh/docs/topics/chart_tests/', type: 'docs' },
      { title: 'Chart Dependencies', url: 'https://helm.sh/docs/helm/helm_dependency/', type: 'docs' },
    ],
    exercise: {
      description: 'Add a pre-install hook to your Helm chart that runs a database migration job, and a helm test that checks the app responds on /health.',
      steps: [
        'Create templates/pre-install-job.yaml with annotation helm.sh/hook: pre-install',
        'The job runs a migration container (simulate with echo "running migrations")',
        'Set helm.sh/hook-delete-policy: before-hook-creation to clean up old runs',
        'Create templates/tests/test-connection.yaml with annotation helm.sh/hook: test',
        'The test pod runs: wget -qO- http://{{ .Release.Name }}/health',
        'Run: helm install myapp . to trigger the hook',
        'Run: helm test myapp to execute the test',
      ],
      answerHint: 'Hooks run in the order: pre-install → install → post-install. Test hook runs on helm test.',
      answer: `pre-install hook (templates/pre-install-job.yaml):
\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ .Release.Name }}-migrate
  annotations:
    "helm.sh/hook": pre-install,pre-upgrade
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migrate
        image: alpine
        command: ["sh", "-c", "echo 'Running DB migrations...' && sleep 2"]
\`\`\`

test pod (templates/tests/test-connection.yaml):
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: {{ .Release.Name }}-test
  annotations:
    "helm.sh/hook": test
spec:
  restartPolicy: Never
  containers:
  - name: test
    image: busybox
    command: ["wget", "-qO-", "http://{{ .Release.Name }}/health"]
\`\`\``,
    },
  },
  {
    dayNumber: 25,
    topicId: 'cicd',
    title: 'CI/CD: ArgoCD Image Updater & GitOps Automation',
    weekInRotation: 2,
    dayInRotation: 4,
    theoryReading: [
      { title: 'ArgoCD Image Updater', url: 'https://argocd-image-updater.readthedocs.io/en/stable/', type: 'docs' },
      { title: 'GitOps — Closing the Loop', url: 'https://argo-cd.readthedocs.io/en/stable/operator-manual/ci-integration/', type: 'docs' },
      { title: 'Semantic Versioning in CI/CD', url: 'https://semver.org/', type: 'article' },
    ],
    exercise: {
      description: 'Configure ArgoCD Image Updater to automatically update an Application\'s image tag when a new semver tag is pushed to GHCR.',
      steps: [
        'Install ArgoCD Image Updater in the argocd namespace',
        'Add annotations to your ArgoCD Application:',
        '  argocd-image-updater.argoproj.io/image-list: myapp=ghcr.io/myuser/myapp',
        '  argocd-image-updater.argoproj.io/myapp.update-strategy: semver',
        '  argocd-image-updater.argoproj.io/myapp.allow-tags: regexp:^v[0-9]+\\.[0-9]+\\.[0-9]+$',
        'Configure write-back method: git (commits tag back to repo) or direct (patches Argo app)',
        'Push a new tag v1.2.0 to GHCR and watch Image Updater detect and update it',
      ],
      answerHint: 'write-back: git creates a .argocd-source-<app>.yaml file in the repo. write-back: argocd patches the Application directly (not GitOps-pure).',
      answer: `ArgoCD Application with Image Updater annotations:
\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
  annotations:
    argocd-image-updater.argoproj.io/image-list: >
      myapp=ghcr.io/myuser/myapp
    argocd-image-updater.argoproj.io/myapp.update-strategy: semver
    argocd-image-updater.argoproj.io/myapp.allow-tags: >
      regexp:^v[0-9]+\\.[0-9]+\\.[0-9]+$
    argocd-image-updater.argoproj.io/write-back-method: git
    argocd-image-updater.argoproj.io/git-branch: main
spec:
  ...
\`\`\`

Full CI/CD loop:
1. dev pushes code → GitHub Actions builds image → pushes ghcr.io/myuser/myapp:v1.2.0
2. Image Updater polls GHCR every 2 minutes → detects v1.2.0 > v1.1.0
3. Image Updater commits .argocd-source-myapp.yaml with new tag to Git
4. ArgoCD detects Git change → syncs cluster → rolling update`,
    },
  },
  {
    dayNumber: 26,
    topicId: 'autoscaling',
    title: 'AutoScaling: KEDA — Event-Driven Scaling',
    weekInRotation: 2,
    dayInRotation: 5,
    theoryReading: [
      { title: 'KEDA Concepts', url: 'https://keda.sh/docs/latest/concepts/', type: 'docs' },
      { title: 'KEDA Scalers Catalog', url: 'https://keda.sh/docs/latest/scalers/', type: 'docs' },
      { title: 'KEDA + Prometheus Scaler', url: 'https://keda.sh/docs/latest/scalers/prometheus/', type: 'docs' },
    ],
    exercise: {
      description: 'Write a KEDA ScaledObject that scales a worker deployment from 0 to 10 based on a Kafka consumer group lag.',
      steps: [
        'Install KEDA in your cluster',
        'Create a TriggerAuthentication for Kafka credentials (or use SASL_PLAINTEXT for local)',
        'Write a ScaledObject targeting your worker Deployment',
        'Use the kafka scaler: bootstrapServers, consumerGroup, topic, lagThreshold=50',
        'Set minReplicaCount: 0 (scale to zero when no messages)',
        'Set maxReplicaCount: 10',
        'Test by sending 500 messages to the topic and watching kubectl get pods -w',
      ],
      answerHint: 'lagThreshold=50 means: for every 50 messages in lag, add 1 replica. 500 lag → 10 replicas.',
      answer: `\`\`\`yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: worker-scaler
  namespace: default
spec:
  scaleTargetRef:
    name: kafka-worker
  minReplicaCount: 0
  maxReplicaCount: 10
  pollingInterval: 15
  cooldownPeriod: 30
  triggers:
  - type: kafka
    metadata:
      bootstrapServers: kafka.kafka.svc.cluster.local:9092
      consumerGroup: my-consumer-group
      topic: my-topic
      lagThreshold: "50"
      offsetResetPolicy: latest
\`\`\`

Scale to zero advantage: when Kafka topic has no messages, workers scale to 0 (no cost). When messages arrive, KEDA scales up before the next poll cycle.

KEDA works alongside HPA — they both modify the replica count on the same Deployment, but KEDA takes precedence for its own ScaledObjects.`,
    },
  },
  {
    dayNumber: 27,
    topicId: 'ansible',
    title: 'Ansible: Vault, Variables & Dynamic Inventory',
    weekInRotation: 2,
    dayInRotation: 6,
    theoryReading: [
      { title: 'Ansible Vault', url: 'https://docs.ansible.com/ansible/latest/vault_guide/index.html', type: 'docs' },
      { title: 'Working with Dynamic Inventory', url: 'https://docs.ansible.com/ansible/latest/inventory_guide/intro_dynamic_inventory.html', type: 'docs' },
      { title: 'Variable Precedence', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#variable-precedence', type: 'docs' },
    ],
    exercise: {
      description: 'Encrypt a secrets file with Ansible Vault, use it in a playbook, and write a dynamic inventory script that reads hosts from a JSON file.',
      steps: [
        'Create secrets.yml with db_password: "s3cr3t"',
        'Encrypt it: ansible-vault encrypt secrets.yml',
        'Create a playbook that includes vars_files: [secrets.yml]',
        'Use the var: "DB password is {{ db_password }}"',
        'Run with: ansible-playbook playbook.yml --ask-vault-pass',
        'Write a dynamic inventory script (inventory.py) that outputs JSON with _meta hostvars',
        'Test: ansible-inventory -i inventory.py --list',
      ],
      answerHint: 'Dynamic inventory scripts must output JSON with {\"all\": {\"hosts\": [...]}, \"_meta\": {\"hostvars\": {}}}.',
      answer: `Vault usage:
\`\`\`bash
# Encrypt
ansible-vault encrypt secrets.yml

# View without decrypting
ansible-vault view secrets.yml

# Edit
ansible-vault edit secrets.yml

# Use in playbook
ansible-playbook playbook.yml --vault-password-file ~/.vault_pass
\`\`\`

Dynamic inventory script (inventory.py):
\`\`\`python
#!/usr/bin/env python3
import json

inventory = {
    "webservers": {
        "hosts": ["192.168.68.151", "192.168.68.152"],
        "vars": {"ansible_user": "ubuntu"}
    },
    "databases": {
        "hosts": ["192.168.68.150"],
    },
    "_meta": {
        "hostvars": {
            "192.168.68.150": {"ansible_user": "ubuntu", "role": "master"}
        }
    }
}

print(json.dumps(inventory))
\`\`\`

Variable precedence (lowest to highest):
defaults → inventory vars → playbook vars → task vars → extra_vars (-e)`,
    },
  },
  {
    dayNumber: 28,
    topicId: 'git',
    title: 'Git: Branching Strategies & Monorepo Workflows',
    weekInRotation: 2,
    dayInRotation: 7,
    theoryReading: [
      { title: 'Trunk Based Development', url: 'https://trunkbaseddevelopment.com/', type: 'article' },
      { title: 'Git Flow vs GitHub Flow', url: 'https://www.atlassian.com/git/tutorials/comparing-workflows', type: 'article' },
      { title: 'Monorepo Tools', url: 'https://monorepo.tools/', type: 'article' },
    ],
    exercise: {
      description: 'Set up a Git repository with branch protection rules, a conventional commits hook, and practice a feature branch workflow with squash merge.',
      steps: [
        'Create a repo and push to GitHub',
        'In GitHub Settings → Branches: protect main (require PR, require status checks)',
        'Create .git/hooks/commit-msg to enforce conventional commit format',
        'The hook should reject commits not matching: ^(feat|fix|chore|docs|refactor):',
        'Create feature/my-feature branch, make 3 commits',
        'Open a PR and use "Squash and merge"',
        'Observe: 3 commits become 1 on main',
      ],
      answerHint: 'The commit-msg hook receives the commit message file path as $1. Read it and validate with grep.',
      answer: `commit-msg hook (.git/hooks/commit-msg):
\`\`\`bash
#!/usr/bin/env bash
MSG=$(cat "$1")
PATTERN='^(feat|fix|chore|docs|refactor|test|ci|style|perf)(\(.+\))?: .{1,72}'

if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo "ERROR: Commit message must follow Conventional Commits format"
  echo "Examples:"
  echo "  feat: add user authentication"
  echo "  fix(api): handle null response from upstream"
  echo "  chore: update dependencies"
  exit 1
fi
\`\`\`

Make executable: chmod +x .git/hooks/commit-msg

Branching strategy comparison:
- Git Flow: long-lived branches (develop, release) — good for versioned releases
- GitHub Flow: branch → PR → main — good for continuous deployment
- Trunk Based Development: commit directly to main with feature flags — best for CI/CD velocity

For GitOps homelabs: GitHub Flow or TBD work best.`,
    },
  },
  // ────────────────────────────────────────────────────────────
  // DAYS 29–30 — Cross-topic integration
  // ────────────────────────────────────────────────────────────
  {
    dayNumber: 29,
    topicId: 'kubernetes',
    title: 'Kubernetes: Network Policies & Pod Security',
    weekInRotation: 1,
    dayInRotation: 1,
    theoryReading: [
      { title: 'Network Policies', url: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/', type: 'docs' },
      { title: 'Pod Security Standards', url: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/', type: 'docs' },
      { title: 'Kubernetes Security Checklist', url: 'https://kubernetes.io/docs/concepts/security/security-checklist/', type: 'docs' },
    ],
    exercise: {
      description: 'Write a NetworkPolicy that implements a default-deny for a namespace and then explicitly allows ingress to the web tier from the ingress controller only.',
      steps: [
        'Apply a default-deny-all NetworkPolicy (empty podSelector + policyTypes both)',
        'Verify: the web pod is unreachable from other pods',
        'Create a NetworkPolicy that allows ingress on port 80 to pods with app=web',
        'Restrict source: only pods with label app=nginx-ingress in the ingress namespace',
        'Also allow DNS egress: port 53 UDP to kube-dns',
        'Test connectivity from a test pod: wget http://web-svc should succeed from ingress, fail from other pods',
      ],
      answerHint: 'An empty podSelector {} matches ALL pods in the namespace. namespaceSelector matches source namespaces.',
      answer: `Default deny all:
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
\`\`\`

Allow ingress from ingress controller only:
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-controller
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes: [Ingress]
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
      podSelector:
        matchLabels:
          app.kubernetes.io/name: ingress-nginx
    ports:
    - port: 80
\`\`\`

Allow DNS egress:
\`\`\`yaml
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
    ports:
    - protocol: UDP
      port: 53
\`\`\``,
    },
  },
  {
    dayNumber: 30,
    topicId: 'terraform',
    title: 'Capstone: Full GitOps Stack with Terraform + Helm + ArgoCD',
    weekInRotation: 1,
    dayInRotation: 3,
    theoryReading: [
      { title: 'Terraform Kubernetes Provider', url: 'https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs', type: 'docs' },
      { title: 'ArgoCD ApplicationSet', url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/application-set/', type: 'docs' },
      { title: '12-Factor App', url: 'https://12factor.net/', type: 'article' },
    ],
    exercise: {
      description: 'Design and document a full GitOps deployment pipeline: Terraform provisions infra → Ansible bootstraps k3s → ArgoCD syncs apps. Map every tool to its responsibility.',
      steps: [
        'Draw the pipeline: what does each tool own?',
        'Terraform: VMs, networking, DNS, load balancer',
        'Ansible: OS config, k3s install, ArgoCD bootstrap, sealed-secrets install',
        'ArgoCD: all Kubernetes workloads from Git (apps + infrastructure)',
        'Helm: packaging of individual apps',
        'GitHub Actions: building container images, pushing to registry',
        'Write a one-page architecture decision record (ADR) explaining why each tool was chosen',
        'Identify: what is the blast radius of each layer failing?',
      ],
      answerHint: 'The separation of concerns is the key: Terraform=infra, Ansible=bootstrap, ArgoCD=runtime. Each layer is independently replaceable.',
      answer: `Tool responsibility matrix:

| Layer | Tool | Owns | Blast Radius |
|-------|------|------|-------------|
| Infra | Terraform | VMs, disks, networks | Full cluster down |
| Bootstrap | Ansible | k3s, ArgoCD, certs | Re-run to recover |
| Runtime | ArgoCD | All K8s workloads | Per-app |
| Packaging | Helm | App config + K8s manifests | Per-app |
| Images | GitHub Actions | Container builds | Per-service |
| Secrets | Sealed Secrets | Encrypted secrets in Git | Per-secret |

GitOps northstar: Git is the single source of truth. No manual kubectl apply in production.

The feedback loop:
code → PR → CI tests → merge → image build → argocd detects → sync → healthy

30-Day achievement: You've touched every layer of the modern DevOps stack. The 1% compounds — keep the rotation going for month 2.`,
    },
  },
]
