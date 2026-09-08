// Mock Datasets for NodeWars Arena

export const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    badge: 'Titan Tier',
    difficulty: 'Hard',
    accentColor: '#4285F4',
    logoText: 'G',
    description: 'Graph theory, dynamic programming & large scale distributed algorithms.',
    perk: '+25% Extra ELO on victory',
    questionsCount: 142
  },
  {
    id: 'amazon',
    name: 'Amazon',
    badge: 'Apex Logistics',
    difficulty: 'Med-Hard',
    accentColor: '#FF9900',
    logoText: 'A',
    description: 'Greedy algorithms, sliding window bottlenecks & priority queues.',
    perk: 'Fast-Paced Speedrun Bonus',
    questionsCount: 128
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    badge: 'OS Core',
    difficulty: 'Medium',
    accentColor: '#00A4EF',
    logoText: 'MS',
    description: 'Binary trees traversal, memory pointers, DFS/BFS and LRU caches.',
    perk: 'Double Streak Multiplier',
    questionsCount: 115
  },
  {
    id: 'tcs',
    name: 'TCS',
    badge: 'Enterprise',
    difficulty: 'Speed',
    accentColor: '#5eead4',
    logoText: 'TCS',
    description: 'Number theory, matrix transformations, string permutations & logic speedruns.',
    perk: 'High APM / Speedrun Arena',
    questionsCount: 95
  },
  {
    id: 'infosys',
    name: 'Infosys',
    badge: 'Digital Special',
    difficulty: 'Medium',
    accentColor: '#818cf8',
    logoText: 'INFY',
    description: 'Dynamic graph connectivity, interval scheduling & bitmask permutations.',
    perk: 'Precision Accuracy Boost',
    questionsCount: 88
  }
];

export const TOPICS = [
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

export const PROBLEMS_DATABASE = {
  'google-dp': {
    id: 'google-dp-1',
    title: 'Quantum Teleportation Energy Matrix',
    company: 'Google',
    companyId: 'google',
    topic: 'Dynamic Programming',
    difficulty: 'Hard',
    timeLimit: '1.2s',
    memoryLimit: '128 MB',
    description: `You are orchestrating a distributed quantum server network consisting of \`N\` relay nodes. Each node \`i\` has an initial energy charge \`energy[i]\` and can jump to any node \`j > i\` if \`j - i <= energy[i]\`.

Transitioning between nodes consumes quantum coolant. The cost between node \`i\` and node \`j\` is defined as:
\`\`\`text
Cost(i, j) = |energy[i] - energy[j]| * (j - i)
\`\`\`

Return the **minimum total coolant cost** to reach node \`N-1\` starting from node \`0\`. If unreachable, return \`-1\`.`,
    examples: [
      {
        input: 'energy = [4, 1, 5, 2, 3]',
        output: '7',
        explanation: 'Path 0 -> 2 cost: |4 - 5| * 2 = 2. Path 2 -> 4 cost: |5 - 3| * 2 = 5. Total = 2 + 5 = 7.'
      },
      {
        input: 'energy = [1, 2, 1, 1, 1]',
        output: '4',
        explanation: 'Step through nodes 0 -> 1 -> 3 -> 4 gives minimal cost: 1 + 2 + 1 = 4.'
      }
    ],
    constraints: [
      '1 <= energy.length <= 10^5',
      '0 <= energy[i] <= 10^4',
      'Time complexity target: O(N log N) or O(N)',
      'Space complexity target: O(N)'
    ],
    hints: [
      'Notice that this can be framed as a shortest path in a DAG or an optimized 1D DP array with monotonic queues.',
      'Check unreachable bounds where energy[i] == 0 prevents forward progress.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} energy
 * @return {number}
 */
function minQuantumCost(energy) {
  // TODO: implement
  return -1;
}`,
      python: `class Solution:
    def minQuantumCost(self, energy: list[int]) -> int:
        # TODO: implement
        return -1`,
      cpp: `class Solution {
public:
    int minQuantumCost(vector<int>& energy) {
        // TODO: implement
        return -1;
    }
};`,
      java: `class Solution {
    public int minQuantumCost(int[] energy) {
        // TODO: implement
        return -1;
    }
}`
    },
    testCases: [
      { id: 1, input: '[4, 1, 5, 2, 3]', expected: '7', runtime: '14ms', memory: '41.2 MB' },
      { id: 2, input: '[1, 2, 1, 1, 1]', expected: '4', runtime: '12ms', memory: '41.1 MB' },
      { id: 3, input: '[3, 0, 0, 1, 2]', expected: '6', runtime: '15ms', memory: '41.4 MB' },
      { id: 4, input: '[0, 2, 3]', expected: '-1', runtime: '11ms', memory: '40.9 MB' },
      { id: 5, input: '[5, 4, 3, 2, 1, 0, 6]', expected: '12', runtime: '18ms', memory: '42.0 MB' }
    ]
  },

  'amazon-arrays': {
    id: 'amazon-arr-1',
    title: 'Autonomous Drone Fleet Collision Avoidance',
    company: 'Amazon',
    companyId: 'amazon',
    topic: 'Arrays & Two Pointers',
    difficulty: 'Medium',
    timeLimit: '1.0s',
    memoryLimit: '64 MB',
    description: `An Amazon Prime Air hub monitors \`N\` delivery drones flying along a single 1D flight corridor. You are given an integer array \`speed\` where \`speed[i]\` represents the velocity of drone \`i\` (positive = East, negative = West).

When two drones collide:
- The smaller absolute speed explodes.
- Equal speeds result in mutual destruction.
- Drones moving in identical directions or away from each other never collide.

Return the state of surviving drone speeds from West to East after all collisions.`,
    examples: [
      {
        input: 'speed = [5, 10, -5]',
        output: '[5, 10]',
        explanation: 'The 10 and -5 collide resulting in 10 surviving. 5 and 10 never collide.'
      },
      {
        input: 'speed = [8, -8]',
        output: '[]',
        explanation: 'The 8 and -8 collide and destroy each other simultaneously.'
      }
    ],
    constraints: [
      '2 <= speed.length <= 10^4',
      '-1000 <= speed[i] <= 1000',
      'speed[i] != 0'
    ],
    hints: [
      'Use a stack to simulate drone collisions from left to right.',
      'A collision only occurs when top of stack > 0 and current drone < 0.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} speed
 * @return {number[]}
 */
function droneCollisions(speed) {
  // TODO: implement
  return [];
}`,
      python: `class Solution:
    def droneCollisions(self, speed: list[int]) -> list[int]:
        # TODO: implement
        return []`,
      cpp: `class Solution {
public:
    vector<int> droneCollisions(vector<int>& speed) {
        // TODO: implement
        return {};
    }
};`,
      java: `class Solution {
    public int[] droneCollisions(int[] speed) {
        // TODO: implement
        return new int[]{};
    }
}`
    },
    testCases: [
      { id: 1, input: '[5, 10, -5]', expected: '[5, 10]', runtime: '10ms', memory: '39.8 MB' },
      { id: 2, input: '[8, -8]', expected: '[]', runtime: '8ms', memory: '38.5 MB' },
      { id: 3, input: '[10, 2, -5]', expected: '[10]', runtime: '12ms', memory: '40.1 MB' },
      { id: 4, input: '[-2, -1, 1, 2]', expected: '[-2, -1, 1, 2]', runtime: '9ms', memory: '39.0 MB' },
      { id: 5, input: '[1, -2, -2, -2]', expected: '[-2, -2, -2]', runtime: '14ms', memory: '40.6 MB' }
    ]
  },

  'default-problem': {
    id: 'default-1',
    title: 'Cyber Grid Shortest Packet Route',
    company: 'Microsoft',
    companyId: 'microsoft',
    topic: 'Graphs & BFS',
    difficulty: 'Medium',
    timeLimit: '1.0s',
    memoryLimit: '64 MB',
    description: `Given an \`m x n\` cyber grid where \`0\` represents an uncompromised firewall node and \`1\` represents an obstacle, return the length of the shortest clear path from \`(0, 0)\` to \`(m-1, n-1)\`.

You can move in 8 directions. If no clear path exists, return \`-1\`.`,
    examples: [
      {
        input: 'grid = [[0,0,0],[1,1,0],[1,1,0]]',
        output: '4',
        explanation: 'Path: (0,0) -> (0,1) -> (1,2) -> (2,2) length = 4.'
      },
      {
        input: 'grid = [[1,0,0],[1,1,0],[1,1,0]]',
        output: '-1',
        explanation: 'Starting node is blocked.'
      }
    ],
    constraints: [
      '1 <= m, n <= 100',
      'grid[i][j] is either 0 or 1'
    ],
    hints: [
      'Use Breadth-First Search (BFS) starting from (0, 0).',
      'Mark cells as visited to avoid cycles.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function shortestPathBinaryMatrix(grid) {
  // TODO: implement
  return -1;
}`,
      python: `from collections import deque

class Solution:
    def shortestPathBinaryMatrix(self, grid: list[list[int]]) -> int:
        n = len(grid)
        if grid[0][0] != 0 or grid[n-1][n-1] != 0:
            return -1
        if n == 1:
            return 1
            
        queue = deque([(0, 0, 1)])
        grid[0][0] = 1
        
        while queue:
            r, c, dist = queue.popleft()
            if r == n - 1 and c == n - 1:
                return dist
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if dr == 0 and dc == 0:
                        continue
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                        grid[nr][nc] = 1
                        queue.append((nr, nc, dist + 1))
        return -1`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] != 0 || grid[n-1][n-1] != 0) return -1;
        if (n == 1) return 1;

        queue<pair<pair<int, int>, int>> q;
        q.push({{0, 0}, 1});
        grid[0][0] = 1;

        int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};

        while (!q.empty()) {
            auto [pos, dist] = q.front();
            q.pop();
            int r = pos.first, c = pos.second;
            if (r == n - 1 && c == n - 1) return dist;

            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;
                    q.push({{nr, nc}, dist + 1});
                }
            }
        }
        return -1;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] != 0 || grid[n-1][n-1] != 0) return -1;
        if (n == 1) return 1;

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1});
        grid[0][0] = 1;

        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];
            if (r == n - 1 && c == n - 1) return dist;

            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }
        return -1;
    }
}`
    },
    testCases: [
      { id: 1, input: '[[0,0,0],[1,1,0],[1,1,0]]', expected: '4', runtime: '11ms', memory: '40.2 MB' },
      { id: 2, input: '[[1,0,0],[1,1,0],[1,1,0]]', expected: '-1', runtime: '8ms', memory: '39.0 MB' },
      { id: 3, input: '[[0,1],[1,0]]', expected: '2', runtime: '10ms', memory: '39.5 MB' },
      { id: 4, input: '[[0,0,0,0],[1,0,1,0],[0,0,0,0],[0,1,1,0]]', expected: '5', runtime: '16ms', memory: '41.8 MB' },
      { id: 5, input: '[[0]]', expected: '1', runtime: '6ms', memory: '38.0 MB' }
    ]
  },

  'infosys-strings': {
    id: 'infosys-strings-1',
    title: 'Longest Substring Without Repeating Characters',
    company: 'Infosys',
    companyId: 'infosys',
    topic: 'Strings & Hashing',
    topicId: 'strings',
    difficulty: 'Medium',
    timeLimit: '1.0s',
    memoryLimit: '64 MB',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: ['Use sliding window with a hash map to track character indices.'],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // TODO: implement
  return 0;
}`
    },
    testCases: [
      { id: 1, input: '"abcabcbb"', expected: '3', runtime: '8ms', memory: '39.1 MB' },
      { id: 2, input: '"bbbbb"', expected: '1', runtime: '6ms', memory: '38.5 MB' },
      { id: 3, input: '"pwwkew"', expected: '3', runtime: '9ms', memory: '39.0 MB' },
      { id: 4, input: '""', expected: '0', runtime: '4ms', memory: '37.8 MB' }
    ]
  },

  'microsoft-trees': {
    id: 'microsoft-trees-1',
    title: 'Maximum Depth of Binary Search Tree',
    company: 'Microsoft',
    companyId: 'microsoft',
    topic: 'Trees & BSTs',
    topicId: 'trees',
    difficulty: 'Easy',
    timeLimit: '1.0s',
    memoryLimit: '64 MB',
    description: `Given a level-order array representation of a binary tree, return its maximum depth.`,
    examples: [
      { input: 'nodes = [3, 9, 20, null, null, 15, 7]', output: '3', explanation: 'Root to leaf path 3 -> 20 -> 15 has depth 3.' }
    ],
    constraints: ['0 <= nodes.length <= 10^4'],
    hints: ['Traverse the level order representation or compute levels via tree height.'],
    starterCode: {
      javascript: `/**
 * @param {Array} nodes
 * @return {number}
 */
function maxTreeDepth(nodes) {
  // TODO: implement
  return 0;
}`
    },
    testCases: [
      { id: 1, input: '[3, 9, 20, null, null, 15, 7]', expected: '3', runtime: '7ms', memory: '38.9 MB' },
      { id: 2, input: '[1, null, 2]', expected: '2', runtime: '5ms', memory: '38.0 MB' },
      { id: 3, input: '[]', expected: '0', runtime: '4ms', memory: '37.5 MB' }
    ]
  },

  'infosys-recursion': {
    id: 'infosys-recursion-1',
    title: 'Subsets Permutation Generator',
    company: 'Infosys',
    companyId: 'infosys',
    topic: 'Recursion & Backtracking',
    topicId: 'recursion',
    difficulty: 'Medium',
    timeLimit: '1.0s',
    memoryLimit: '64 MB',
    description: `Given an array of unique integers \`nums\`, return the total count of all possible subsets (the power set).`,
    examples: [
      { input: 'nums = [1, 2, 3]', output: '8', explanation: 'There are 2^3 = 8 subsets.' }
    ],
    constraints: ['0 <= nums.length <= 20'],
    hints: ['The number of subsets for a set of size N is 2^N.'],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function subsetCount(nums) {
  // TODO: implement
  return 0;
}`
    },
    testCases: [
      { id: 1, input: '[1, 2, 3]', expected: '8', runtime: '5ms', memory: '38.0 MB' },
      { id: 2, input: '[0]', expected: '2', runtime: '4ms', memory: '37.5 MB' },
      { id: 3, input: '[]', expected: '1', runtime: '3ms', memory: '37.0 MB' }
    ]
  }
};

// Also assign explicit topicId onto all existing database entries
if (PROBLEMS_DATABASE['google-dp']) PROBLEMS_DATABASE['google-dp'].topicId = 'dp';
if (PROBLEMS_DATABASE['amazon-arrays']) PROBLEMS_DATABASE['amazon-arrays'].topicId = 'arrays';
if (PROBLEMS_DATABASE['default-problem']) PROBLEMS_DATABASE['default-problem'].topicId = 'graphs';

export const getProblem = (companyId, topicId) => {
  const problems = Object.values(PROBLEMS_DATABASE);
  let matching = problems.filter((p) => p.topicId === topicId && p.companyId === companyId);

  if (matching.length === 0 && topicId) {
    matching = problems.filter((p) => p.topicId === topicId);
  }

  if (matching.length === 0) {
    matching = problems;
  }

  return matching[Math.floor(Math.random() * matching.length)];
};

// Current User Profile
export const CURRENT_USER = {
  id: 'usr_me',
  username: 'Neon_Ronin',
  title: 'Syntax Assassin',
  archetype: 'neon_ronin',
  rating: 1480,
  tier: 'Silver III',
  tierColor: '#5eead4',
  winStreak: 4,
  duelsFought: 34,
  winRate: '68%',
  cpmSpeed: 48,
  rank: 4
};

// Pool of Mock Competitors with Archetypes
export const OPPONENTS_POOL = [
  {
    id: 'opp_1',
    username: 'Byte_Reaper',
    title: 'Brute Force Marauder',
    archetype: 'byte_reaper',
    rating: 1495,
    tier: 'Silver III',
    tierColor: '#fb7444',
    winStreak: 3,
    winRate: '64%',
    quote: 'O(1) memory or total stack overflow.'
  },
  {
    id: 'opp_2',
    username: 'Syntax_Phantom',
    title: 'Compiler Ghost',
    archetype: 'byte_reaper',
    rating: 1520,
    tier: 'Gold I',
    tierColor: '#fbbf24',
    winStreak: 6,
    winRate: '72%',
    quote: 'Your edge cases belong to my cache.'
  },
  {
    id: 'opp_3',
    username: 'Quantum_Hacker',
    title: 'Neural Matrix Adept',
    archetype: 'quantum_hacker',
    rating: 1540,
    tier: 'Gold I',
    tierColor: '#c084fc',
    winStreak: 8,
    winRate: '76%',
    quote: 'Memoizing your downfall in linear time.'
  }
];

// Teammates Pool
export const TEAMMATES_POOL = [
  {
    id: 'team_1',
    username: 'Glitch_Valkyrie',
    title: 'Two-Pointer Anchor',
    archetype: 'glitch_valkyrie',
    rating: 1475,
    tier: 'Silver III',
    winStreak: 2
  },
  {
    id: 'opp_team_1',
    username: 'Core_Sentinel',
    title: 'Shield Master',
    archetype: 'core_sentinel',
    rating: 1510,
    tier: 'Gold I',
    winStreak: 4
  }
];

// Global Leaderboard Data
export const LEADERBOARD_DATA = [
  {
    rank: 1,
    username: 'Mech_Overlord',
    title: 'Apex Grandmaster',
    archetype: 'mech_overlord',
    rating: 2480,
    tier: 'Grandmaster',
    tierBadge: '👑',
    tierColor: '#f43f5e',
    winStreak: 18,
    winRate: '94%',
    duels: 382
  },
  {
    rank: 2,
    username: 'Quantum_Hacker',
    title: 'Diamond High-Archon',
    archetype: 'quantum_hacker',
    rating: 2150,
    tier: 'Diamond I',
    tierBadge: '💎',
    tierColor: '#c084fc',
    winStreak: 12,
    winRate: '88%',
    duels: 290
  },
  {
    rank: 3,
    username: 'Glitch_Valkyrie',
    title: 'Platinum Specialist',
    archetype: 'glitch_valkyrie',
    rating: 1940,
    tier: 'Platinum II',
    tierBadge: '⭐',
    tierColor: '#38bdf8',
    winStreak: 9,
    winRate: '82%',
    duels: 215
  },
  {
    rank: 4,
    username: 'Neon_Ronin (You)',
    title: 'Syntax Assassin',
    archetype: 'neon_ronin',
    isUser: true,
    rating: 1480,
    tier: 'Silver III',
    tierBadge: '⚡',
    tierColor: '#5eead4',
    winStreak: 4,
    winRate: '68%',
    duels: 34
  },
  {
    rank: 5,
    username: 'Byte_Reaper',
    title: 'Silver Striker',
    archetype: 'byte_reaper',
    rating: 1445,
    tier: 'Silver II',
    tierBadge: '🗡️',
    tierColor: '#94a3b8',
    winStreak: 3,
    winRate: '62%',
    duels: 51
  }
];

export const LIVE_ACTIVITY_EVENTS = [
  { id: 1, text: '🌫️ @Quantum_Hacker deployed [Syntax Fog] against @ByteKnight' },
  { id: 2, text: '🏆 @Mech_Overlord defended #1 Grandmaster with 0.4ms solve' },
  { id: 3, text: '🔍 @Neon_Ronin used [Code Scan] in Google Arena' },
  { id: 4, text: '🛡️ @Glitch_Valkyrie activated [Firewall] (40 Charge)' },
  { id: 5, text: '💡 @Syntax_Phantom unlocked a [Conceptual Hint] in Dynamic Programming' }
];
