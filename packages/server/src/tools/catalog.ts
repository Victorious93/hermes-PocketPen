export interface ToolArg {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required?: boolean;
  description?: string;
  default?: any;
  options?: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  cliTemplate: string; // e.g. "nmap -sS {target} -oX {output}"
  args: ToolArg[];
  risk: 'low' | 'medium' | 'high';
  recommended?: string; // short recommended profile
}

export const kaliTools: Tool[] = [
  {
    id: 'nmap',
    name: 'Nmap',
    description: 'Network discovery and port scanning (host/service detection, scripts).',
    cliTemplate: 'nmap -sS {target} -p {ports} -oX {output}',
    args: [
      { name: 'target', type: 'string', required: true, description: 'IP, range, or hostname (e.g. 192.168.1.0/24)' },
      { name: 'ports', type: 'string', required: false, description: 'Port range (e.g. 1-65535 or 80,443)', default: '1-1024' },
      { name: 'output', type: 'string', required: false, description: 'Output file path', default: 'nmap_result.xml' }
    ],
    risk: 'low',
    recommended: 'Quick network discovery (safe)'
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework',
    description: 'Exploit development, payloads, and post-exploitation modules (high risk).',
    cliTemplate: 'msfconsole -q -x "use {module}; set RHOST {target}; set PAYLOAD {payload}; run"',
    args: [
      { name: 'module', type: 'string', required: true },
      { name: 'target', type: 'string', required: true },
      { name: 'payload', type: 'string', required: true }
    ],
    risk: 'high',
    recommended: 'Admin-only, sandboxed'
  },
  {
    id: 'wireshark',
    name: 'Wireshark (tshark)',
    description: 'Packet capture and protocol analysis.',
    cliTemplate: 'tshark -i {interface} -w {output}',
    args: [
      { name: 'interface', type: 'string', required: true },
      { name: 'output', type: 'string', required: false, default: 'capture.pcap' }
    ],
    risk: 'medium'
  },
  {
    id: 'aircrack-ng',
    name: 'Aircrack-ng',
    description: 'Wireless packet capture and WEP/WPA cracking (requires capture files).',
    cliTemplate: 'aircrack-ng {capture} -w {wordlist}',
    args: [
      { name: 'capture', type: 'string', required: true },
      { name: 'wordlist', type: 'string', required: false }
    ],
    risk: 'high'
  },
  {
    id: 'john',
    name: 'John the Ripper',
    description: 'Password cracking with wordlists and rules.',
    cliTemplate: 'john --wordlist={wordlist} {hashfile}',
    args: [
      { name: 'wordlist', type: 'string', required: true },
      { name: 'hashfile', type: 'string', required: true }
    ],
    risk: 'medium'
  },
  {
    id: 'hashcat',
    name: 'Hashcat',
    description: 'GPU-accelerated password/hash cracking.',
    cliTemplate: 'hashcat -m {hashMode} {hashfile} {wordlist}',
    args: [
      { name: 'hashMode', type: 'string', required: true },
      { name: 'hashfile', type: 'string', required: true },
      { name: 'wordlist', type: 'string', required: true }
    ],
    risk: 'medium'
  },
  {
    id: 'hydra',
    name: 'Hydra',
    description: 'Online brute-force login cracker for many protocols (ssh, ftp, http).',
    cliTemplate: 'hydra -L {userlist} -P {passlist} {target} {service}',
    args: [
      { name: 'userlist', type: 'string', required: true },
      { name: 'passlist', type: 'string', required: true },
      { name: 'target', type: 'string', required: true },
      { name: 'service', type: 'string', required: true }
    ],
    risk: 'high'
  },
  {
    id: 'burpsuite',
    name: 'Burp Suite',
    description: 'Web proxy and scanner for request manipulation and analysis.',
    cliTemplate: 'burpsuite',
    args: [],
    risk: 'medium'
  },
  {
    id: 'sqlmap',
    name: 'sqlmap',
    description: 'Automated SQL injection detection and exploitation.',
    cliTemplate: 'sqlmap -u "{url}" --batch -o {output}',
    args: [
      { name: 'url', type: 'string', required: true },
      { name: 'output', type: 'string', required: false }
    ],
    risk: 'high'
  },
  {
    id: 'nikto',
    name: 'Nikto',
    description: 'Web server scanner for known issues and misconfigurations.',
    cliTemplate: 'nikto -h {target} -output {output}',
    args: [
      { name: 'target', type: 'string', required: true },
      { name: 'output', type: 'string', required: false }
    ],
    risk: 'medium'
  },
  {
    id: 'netcat',
    name: 'Netcat',
    description: 'TCP/UDP connection tool and simple listener/backdoor.',
    cliTemplate: 'nc {host} {port}',
    args: [
      { name: 'host', type: 'string', required: true },
      { name: 'port', type: 'number', required: true }
    ],
    risk: 'high'
  },
  {
    id: 'openvas',
    name: 'OpenVAS (Greenbone)',
    description: 'Vulnerability scanning and management.',
    cliTemplate: 'openvas --target {target} --report {output}',
    args: [
      { name: 'target', type: 'string', required: true },
      { name: 'output', type: 'string', required: false }
    ],
    risk: 'medium'
  },
  {
    id: 'gobuster',
    name: 'Gobuster',
    description: 'Directory and DNS enumeration via wordlists.',
    cliTemplate: 'gobuster dir -u {url} -w {wordlist} -o {output}',
    args: [
      { name: 'url', type: 'string', required: true },
      { name: 'wordlist', type: 'string', required: true },
      { name: 'output', type: 'string', required: false }
    ],
    risk: 'medium'
  },
  {
    id: 'wpscan',
    name: 'WPScan',
    description: 'WordPress vulnerability scanner and enumeration.',
    cliTemplate: 'wpscan --url {url} --enumerate u,vp,vt --output {output}',
    args: [
      { name: 'url', type: 'string', required: true },
      { name: 'output', type: 'string', required: false }
    ],
    risk: 'medium'
  },
  {
    id: 'dirb',
    name: 'Dirb',
    description: 'Web content scanner / directory brute-forcer.',
    cliTemplate: 'dirb {url} {wordlist} -o {output}',
    args: [
      { name: 'url', type: 'string', required: true },
      { name: 'wordlist', type: 'string', required: true }
    ],
    risk: 'medium'
  },
  {
    id: 'responder',
    name: 'Responder',
    description: 'LLM/NetBIOS/LLMNR/NBT-NS poisoning and credential capture.',
    cliTemplate: 'responder -I {interface} -w -r',
    args: [
      { name: 'interface', type: 'string', required: true }
    ],
    risk: 'high'
  },
  {
    id: 'tcpdump',
    name: 'tcpdump',
    description: 'Command-line packet capture and filtering.',
    cliTemplate: 'tcpdump -i {interface} -w {output}',
    args: [
      { name: 'interface', type: 'string', required: true },
      { name: 'output', type: 'string', required: false }
    ],
    risk: 'medium'
  },
  {
    id: 'ettercap',
    name: 'Ettercap',
    description: 'Network MITM and traffic manipulation.',
    cliTemplate: 'ettercap -T -i {interface} -M arp:remote //{target}//',
    args: [
      { name: 'interface', type: 'string', required: true },
      { name: 'target', type: 'string', required: true }
    ],
    risk: 'high'
  },
  {
    id: 'set',
    name: 'Social-Engineer Toolkit (SET)',
    description: 'Social-engineering attack automation (phishing, payloads).',
    cliTemplate: 'setoolkit',
    args: [],
    risk: 'high',
    recommended: 'Admin-only, explicit consent required'
  },
  {
    id: 'beef',
    name: 'BeEF (Browser Exploitation Framework)',
    description: 'Browser exploitation framework for client-side attack vectors.',
    cliTemplate: 'beef',
    args: [],
    risk: 'high',
    recommended: 'Admin-only, isolated environment'
  }
];

export default kaliTools;
