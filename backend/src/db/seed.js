const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { db } = require('./index');

const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    badge: 'Titan Tier',
    difficulty: 'Hard',
    accent_color: '#4285F4',
    logo_text: 'G',
    description: 'Graph theory, dynamic programming & large scale distributed algorithms.',
    perk: '+25% Extra ELO on victory',
    questions_count: 142
  },
  {
    id: 'amazon',
    name: 'Amazon',
    badge: 'Apex Logistics',
    difficulty: 'Med-Hard',
    accent_color: '#FF9900',
    logo_text: 'A',
    description: 'Greedy algorithms, sliding window bottlenecks & priority queues.',
    perk: 'Fast-Paced Speedrun Bonus',
    questions_count: 128
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    badge: 'OS Core',
    difficulty: 'Medium',
    accent_color: '#00A4EF',
    logo_text: 'MS',
    description: 'Binary trees traversal, memory pointers, DFS/BFS and LRU caches.',
    perk: 'Double Streak Multiplier',
    questions_count: 115
  },
  {
    id: 'tcs',
    name: 'TCS',
    badge: 'Enterprise',
    difficulty: 'Speed',
    accent_color: '#5eead4',
    logo_text: 'TCS',
    description: 'Number theory, matrix transformations, string permutations & logic speedruns.',
    perk: 'High APM / Speedrun Arena',
    questions_count: 95
  },
  {
    id: 'infosys',
    name: 'Infosys',
    badge: 'Digital Special',
    difficulty: 'Medium',
    accent_color: '#818cf8',
    logo_text: 'INFY',
    description: 'Dynamic graph connectivity, interval scheduling & bitmask permutations.',
    perk: 'Precision Accuracy Boost',
    questions_count: 88
  }
];

const TOPICS = [
  {
    id: 'arrays',
    name: 'Arrays & Two Pointers',
    tag: 'ARRAYS',
    difficulty: 'Standard',
    icon: 'Layers',
    summary: 'Subarrays, prefix sums, two-pointer convergence and sliding windows.',
    popularity: '98% Picked'
  },
  {
    id: 'strings',
    name: 'Strings & Hashing',
    tag: 'STRINGS',
    difficulty: 'Standard',
    icon: 'FileCode',
    summary: 'Rabin-Karp rolling hashes, frequency maps, palindromic edge cases.',
    popularity: '94% Picked'
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    tag: 'DP MATRIX',
    difficulty: 'Extreme',
    icon: 'BrainCircuit',
    summary: 'Knapsack state transitions, memoization ladders & DAG optimizations.',
    popularity: '99% Picked'
  },
  {
    id: 'trees',
    name: 'Trees & BSTs',
    tag: 'TREES',
    difficulty: 'Hard',
    icon: 'GitFork',
    summary: 'Lowest Common Ancestor, Morris traversal, AVL balancing and subtree sums.',
    popularity: '91% Picked'
  },
  {
    id: 'graphs',
    name: 'Graphs & BFS/DFS',
    tag: 'GRAPHS',
    difficulty: 'Hard',
    icon: 'Network',
    summary: 'Dijkstra shortest paths, topological sort, connected components.',
    popularity: '95% Picked'
  },
  {
    id: 'recursion',
    name: 'Recursion & Backtracking',
    tag: 'RECURSION',
    difficulty: 'Hard',
    icon: 'Repeat',
    summary: 'N-Queens matrix, subset permutations, pruned decision trees.',
    popularity: '89% Picked'
  }
];

const PROBLEMS = [
  {
    id: 'google-dp-1',
    company_id: 'google',
    topic_id: 'dp',
    title: 'Quantum Teleportation Energy Matrix',
    difficulty: 'Hard',
    time_limit: '1.2s',
    memory_limit: '128 MB',
    description:
      'You are orchestrating a distributed quantum server network consisting of N relay nodes. Each node i has an initial energy charge energy[i] and can jump to any node j > i if j - i <= energy[i]. Return the minimum total coolant cost to reach node N-1 from node 0. If unreachable, return -1.',
    examples: [
      {
        input: 'energy = [4, 1, 5, 2, 3]',
        output: '7',
        explanation: 'Path 0 -> 2 cost 2, path 2 -> 4 cost 5. Total = 7.'
      },
      {
        input: 'energy = [1, 2, 1, 1, 1]',
        output: '4',
        explanation: 'Path 0 -> 1 -> 3 -> 4 gives cost 4.'
      }
    ],
    constraints: [
      '1 <= energy.length <= 10^5',
      '0 <= energy[i] <= 10^4'
    ],
    hints: [
      'Frame this as shortest path on a DAG or optimized 1D DP.',
      'energy[i] == 0 can make a node unreachable forward.'
    ],
    starter_code: {
      javascript: `function minQuantumCost(energy) {\n  // TODO: implement\n  return -1;\n}`,
      python: `class Solution:\n    def minQuantumCost(self, energy: list[int]) -> int:\n        # TODO: implement\n        return -1`,
      cpp: `class Solution {\npublic:\n    int minQuantumCost(vector<int>& energy) {\n        // TODO: implement\n        return -1;\n    }\n};`,
      java: `class Solution {\n    public int minQuantumCost(int[] energy) {\n        // TODO: implement\n        return -1;\n    }\n}`
    },
    test_cases: [
      { id: 1, input: '[4, 1, 5, 2, 3]', expected: '7' },
      { id: 2, input: '[1, 2, 1, 1, 1]', expected: '4' },
      { id: 3, input: '[3, 0, 0, 1, 2]', expected: '6' },
      { id: 4, input: '[0, 2, 3]', expected: '-1' },
      { id: 5, input: '[5, 4, 3, 2, 1, 0, 6]', expected: '12' }
    ]
  },
  {
    id: 'amazon-arrays-1',
    company_id: 'amazon',
    topic_id: 'arrays',
    title: 'Autonomous Drone Fleet Collision Avoidance',
    difficulty: 'Medium',
    time_limit: '1.0s',
    memory_limit: '64 MB',
    description:
      'Given drone speeds (positive = East, negative = West), simulate collisions: smaller abs speed explodes; equal speeds mutual destruction. Return surviving speeds West to East.',
    examples: [
      { input: 'speed = [5, 10, -5]', output: '[5, 10]', explanation: '10 survives vs -5.' },
      { input: 'speed = [8, -8]', output: '[]', explanation: 'Mutual destruction.' }
    ],
    constraints: ['2 <= speed.length <= 10^4', '-1000 <= speed[i] <= 1000', 'speed[i] != 0'],
    hints: [
      'Use a stack to simulate left-to-right collisions.',
      'Collision only when stack top > 0 and current < 0.'
    ],
    starter_code: {
      javascript: `function droneCollisions(speed) {\n  // TODO: implement\n  return [];\n}`,
      python: `class Solution:\n    def droneCollisions(self, speed: list[int]) -> list[int]:\n        return []`,
      cpp: `class Solution {\npublic:\n    vector<int> droneCollisions(vector<int>& speed) {\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] droneCollisions(int[] speed) {\n        return new int[]{};\n    }\n}`
    },
    test_cases: [
      { id: 1, input: '[5, 10, -5]', expected: '[5, 10]' },
      { id: 2, input: '[8, -8]', expected: '[]' },
      { id: 3, input: '[10, 2, -5]', expected: '[10]' },
      { id: 4, input: '[-2, -1, 1, 2]', expected: '[-2, -1, 1, 2]' },
      { id: 5, input: '[1, -2, -2, -2]', expected: '[-2, -2, -2]' }
    ]
  },
  {
    id: 'microsoft-graphs-1',
    company_id: 'microsoft',
    topic_id: 'graphs',
    title: 'Cyber Grid Shortest Packet Route',
    difficulty: 'Medium',
    time_limit: '1.0s',
    memory_limit: '64 MB',
    description:
      'Given an m x n grid (0 = clear, 1 = blocked), return length of shortest clear path from (0,0) to (m-1,n-1) moving in 8 directions. If impossible, return -1.',
    examples: [
      {
        input: 'grid = [[0,0,0],[1,1,0],[1,1,0]]',
        output: '4',
        explanation: 'Path length 4.'
      },
      {
        input: 'grid = [[1,0,0],[1,1,0],[1,1,0]]',
        output: '-1',
        explanation: 'Start blocked.'
      }
    ],
    constraints: ['1 <= m, n <= 100', 'grid[i][j] is 0 or 1'],
    hints: ['Use BFS from (0,0).', 'Mark visited cells to avoid cycles.'],
    starter_code: {
      javascript: `function shortestPathBinaryMatrix(grid) {\n  // TODO: implement\n  return -1;\n}`,
      python: `class Solution:\n    def shortestPathBinaryMatrix(self, grid: list[list[int]]) -> int:\n        return -1`,
      cpp: `class Solution {\npublic:\n    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {\n        return -1;\n    }\n};`,
      java: `class Solution {\n    public int shortestPathBinaryMatrix(int[][] grid) {\n        return -1;\n    }\n}`
    },
    test_cases: [
      { id: 1, input: '[[0,0,0],[1,1,0],[1,1,0]]', expected: '4' },
      { id: 2, input: '[[1,0,0],[1,1,0],[1,1,0]]', expected: '-1' },
      { id: 3, input: '[[0,1],[1,0]]', expected: '2' },
      { id: 4, input: '[[0,0,0,0],[1,0,1,0],[0,0,0,0],[0,1,1,0]]', expected: '5' },
      { id: 5, input: '[[0]]', expected: '1' }
    ]
  },
  {
    id: 'infosys-strings-1',
    company_id: 'infosys',
    topic_id: 'strings',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    time_limit: '1.0s',
    memory_limit: '64 MB',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", length 3.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    hints: ['Use sliding window with index map.'],
    starter_code: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // TODO: implement\n  return 0;\n}`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        return 0`
    },
    test_cases: [
      { id: 1, input: '"abcabcbb"', expected: '3' },
      { id: 2, input: '"bbbbb"', expected: '1' },
      { id: 3, input: '"pwwkew"', expected: '3' },
      { id: 4, input: '""', expected: '0' }
    ]
  },
  {
    id: 'microsoft-trees-1',
    company_id: 'microsoft',
    topic_id: 'trees',
    title: 'Maximum Depth of Binary Search Tree',
    difficulty: 'Easy',
    time_limit: '1.0s',
    memory_limit: '64 MB',
    description: 'Given a level-order array representation of a binary tree, return its maximum depth.',
    examples: [
      { input: 'nodes = [3, 9, 20, null, null, 15, 7]', output: '3', explanation: 'Max depth 3.' }
    ],
    constraints: ['0 <= nodes.length <= 10^4'],
    hints: ['Compute levels from representation height.'],
    starter_code: {
      javascript: `function maxTreeDepth(nodes) {\n  // TODO: implement\n  return 0;\n}`,
      python: `class Solution:\n    def maxTreeDepth(self, nodes: list) -> int:\n        return 0`
    },
    test_cases: [
      { id: 1, input: '[3, 9, 20, null, null, 15, 7]', expected: '3' },
      { id: 2, input: '[1, null, 2]', expected: '2' },
      { id: 3, input: '[]', expected: '0' }
    ]
  },
  {
    id: 'infosys-recursion-1',
    company_id: 'infosys',
    topic_id: 'recursion',
    title: 'Subsets Permutation Generator',
    difficulty: 'Medium',
    time_limit: '1.0s',
    memory_limit: '64 MB',
    description: 'Given an array of unique integers nums, return the total count of all possible subsets.',
    examples: [
      { input: 'nums = [1, 2, 3]', output: '8', explanation: '2^3 = 8 subsets.' }
    ],
    constraints: ['0 <= nums.length <= 20'],
    hints: ['Subsets count for size N is 2^N.'],
    starter_code: {
      javascript: `function subsetCount(nums) {\n  // TODO: implement\n  return 0;\n}`,
      python: `class Solution:\n    def subsetCount(self, nums: list[int]) -> int:\n        return 2 ** len(nums)`
    },
    test_cases: [
      { id: 1, input: '[1, 2, 3]', expected: '8' },
      { id: 2, input: '[0]', expected: '2' },
      { id: 3, input: '[]', expected: '1' }
    ]
  }
];

function seed() {
  const insertCompany = db.prepare(`
    INSERT OR REPLACE INTO companies
    (id, name, badge, difficulty, accent_color, logo_text, description, perk, questions_count)
    VALUES (@id, @name, @badge, @difficulty, @accent_color, @logo_text, @description, @perk, @questions_count)
  `);

  const insertTopic = db.prepare(`
    INSERT OR REPLACE INTO topics
    (id, name, tag, difficulty, icon, summary, popularity)
    VALUES (@id, @name, @tag, @difficulty, @icon, @summary, @popularity)
  `);

  const insertProblem = db.prepare(`
    INSERT OR REPLACE INTO problems
    (id, company_id, topic_id, title, difficulty, time_limit, memory_limit, description,
     examples_json, constraints_json, hints_json, starter_code_json, test_cases_json)
    VALUES (@id, @company_id, @topic_id, @title, @difficulty, @time_limit, @memory_limit, @description,
     @examples_json, @constraints_json, @hints_json, @starter_code_json, @test_cases_json)
  `);

  const tx = db.transaction(() => {
    for (const c of COMPANIES) insertCompany.run(c);
    for (const t of TOPICS) insertTopic.run(t);
    for (const p of PROBLEMS) {
      insertProblem.run({
        ...p,
        examples_json: JSON.stringify(p.examples),
        constraints_json: JSON.stringify(p.constraints),
        hints_json: JSON.stringify(p.hints),
        starter_code_json: JSON.stringify(p.starter_code),
        test_cases_json: JSON.stringify(p.test_cases)
      });
    }

    // Demo account for frontend wiring
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('Neon_Ronin');
    if (!existing) {
      const passwordHash = bcrypt.hashSync('nodewars123', 10);
      db.prepare(`
        INSERT INTO users
        (id, username, email, password_hash, archetype, title, target_company, rating, win_streak, wins, losses, duels_fought)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        'Neon_Ronin',
        'neon@nodewars.dev',
        passwordHash,
        'neon_ronin',
        'Syntax Assassin',
        'Google',
        1480,
        4,
        23,
        11,
        34
      );
    }

    const activityCount = db.prepare('SELECT COUNT(*) AS c FROM activity_events').get().c;
    if (activityCount === 0) {
      const insertActivity = db.prepare('INSERT INTO activity_events (id, text) VALUES (?, ?)');
      const events = [
        '🌫️ @Quantum_Hacker deployed [Syntax Fog] against @ByteKnight',
        '🏆 @Mech_Overlord defended #1 Grandmaster with 0.4ms solve',
        '🔍 @Neon_Ronin used [Code Scan] in Google Arena',
        '🛡️ @Glitch_Valkyrie activated [Firewall] (40 Charge)',
        '💡 @Syntax_Phantom unlocked a [Conceptual Hint] in Dynamic Programming'
      ];
      for (const text of events) insertActivity.run(uuidv4(), text);
    }
  });

  tx();
  console.log('Seed complete.');
  console.log('Demo login: Neon_Ronin / nodewars123');
}

if (require.main === module) {
  seed();
}

module.exports = { seed, COMPANIES, TOPICS, PROBLEMS };
