import { useState, useEffect } from 'react'

// 学习任务分类
const categories = [
  { id: 'reading', name: '阅读', icon: '📖', color: 'bg-pink-400' },
  { id: 'coding', name: '编程', icon: '💻', color: 'bg-purple-400' },
  { id: 'language', name: '语言', icon: '🌍', color: 'bg-blue-400' },
  { id: 'exercise', name: '运动', icon: '🏃', color: 'bg-green-400' },
  { id: 'other', name: '其他', icon: '📝', color: 'bg-orange-400' },
]

// 初始任务数据
const initialTasks = [
  { id: 1, name: '阅读《深入理解计算机系统》第3章', category: 'reading', duration: 60, completed: false, points: 30 },
  { id: 2, name: 'LeetCode 每日一题', category: 'coding', duration: 45, completed: true, points: 25 },
  { id: 3, name: '背诵 50 个英语单词', category: 'language', duration: 30, completed: true, points: 20 },
  { id: 4, name: '学习 React Hooks 文档', category: 'coding', duration: 90, completed: false, points: 40 },
  { id: 5, name: '晨跑 3 公里', category: 'exercise', duration: 30, completed: true, points: 25 },
]

// 本月打卡数据 (模拟)
const generateMonthData = () => {
  const data = []
  for (let i = 1; i <= 31; i++) {
    data.push({
      day: i,
      punched: Math.random() > 0.3,
      tasks: Math.floor(Math.random() * 5) + 1
    })
  }
  return data
}

// 学习记录
const studyRecords = [
  { date: '12月13日', duration: 180, tasks: 5, points: 120 },
  { date: '12月12日', duration: 240, tasks: 6, points: 150 },
  { date: '12月11日', duration: 150, tasks: 4, points: 95 },
  { date: '12月10日', duration: 200, tasks: 5, points: 130 },
  { date: '12月9日', duration: 120, tasks: 3, points: 75 },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('reading')
  const [newTaskDuration, setNewTaskDuration] = useState(30)
  const [showAddModal, setShowAddModal] = useState(false)
  const [streak, setStreak] = useState(15)
  const [totalPoints, setTotalPoints] = useState(2480)
  const [todayPunched, setTodayPunched] = useState(false)
  const [monthData] = useState(generateMonthData())
  const [currentTime, setCurrentTime] = useState(new Date())

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 切换任务完成状态
  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed
        if (newCompleted) {
          setTotalPoints(prev => prev + task.points)
        } else {
          setTotalPoints(prev => prev - task.points)
        }
        return { ...task, completed: newCompleted }
      }
      return task
    }))
  }

  // 添加新任务
  const addTask = () => {
    if (newTaskName.trim()) {
      const points = Math.floor(newTaskDuration / 10) * 5 + 10
      const task = {
        id: Date.now(),
        name: newTaskName,
        category: newTaskCategory,
        duration: newTaskDuration,
        completed: false,
        points
      }
      setTasks([...tasks, task])
      setNewTaskName('')
      setNewTaskDuration(30)
      setShowAddModal(false)
    }
  }

  // 删除任务
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // 打卡
  const handlePunch = () => {
    if (!todayPunched) {
      setTodayPunched(true)
      setStreak(s => s + 1)
      setTotalPoints(p => p + 50)
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0
  const todayDuration = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.duration, 0)
  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50 p-4 md:p-8">
      {/* 顶部标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="text-teal-500">学习</span>
          <span className="text-teal-700 ml-2">打卡</span>
        </h1>
        <p className="text-gray-500 mt-2">每天进步一点点，遇见更好的自己</p>
      </div>

      {/* 用户信息和统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* 用户信息卡片 */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-3xl">
            🎓
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">学习达人</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Lv.{Math.floor(totalPoints / 500) + 1}
              </span>
              <span className="border-2 border-orange-400 text-orange-500 px-3 py-1 rounded-full text-sm font-medium">
                🔥 {streak}天连续
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">当前时间</p>
            <p className="text-lg font-bold text-gray-700">
              {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* 连续打卡 */}
        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start">
            <span className="text-white/80 text-sm">连续打卡</span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="mt-1">
            <span className="text-4xl font-bold">{streak}</span>
            <span className="text-lg ml-1">天</span>
          </div>
          <p className="text-white/70 text-xs mt-1">继续保持！</p>
        </div>

        {/* 总积分 */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start">
            <span className="text-white/80 text-sm">学习积分</span>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="mt-1">
            <span className="text-4xl font-bold">{totalPoints}</span>
            <span className="text-lg ml-1">分</span>
          </div>
          <p className="text-white/70 text-xs mt-1">距离下一等级还需 {500 - (totalPoints % 500)} 分</p>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 - 今日任务 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 今日进度 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <h2 className="text-xl font-bold text-gray-800">今日任务</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">已学习 {todayDuration} 分钟</span>
                <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium">
                  {completedCount}/{tasks.length} 完成
                </span>
              </div>
            </div>
            {/* 进度条 */}
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-green-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>进度 {Math.round(progress)}%</span>
              <span>今日可获得 {tasks.reduce((sum, t) => sum + t.points, 0)} 积分</span>
            </div>
          </div>

          {/* 任务列表 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">任务列表</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <span>+</span> 添加任务
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map(task => {
                const category = getCategoryInfo(task.category)
                return (
                  <div 
                    key={task.id}
                    className={`rounded-xl p-4 border-l-4 transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-400' 
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 复选框 */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-teal-400'
                        }`}
                      >
                        {task.completed && '✓'}
                      </button>
                      
                      {/* 任务信息 */}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                        }`}>
                          {task.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`${category.color} text-white px-2 py-0.5 rounded text-xs`}>
                            {category.icon} {category.name}
                          </span>
                          <span className="text-gray-400 text-xs">⏱ {task.duration}分钟</span>
                        </div>
                      </div>

                      {/* 积分 */}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        +{task.points}分
                      </span>

                      {/* 删除按钮 */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}

              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-4xl mb-2">📝</p>
                  <p>暂无任务，点击上方添加</p>
                </div>
              )}
            </div>
          </div>

          {/* 学习记录 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <h2 className="text-xl font-bold text-gray-800">学习记录</h2>
              </div>
              <button className="text-teal-500 hover:text-teal-600 text-sm font-medium">
                查看全部 →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-sm">日期</th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium text-sm">学习时长</th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium text-sm">完成任务</th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium text-sm">获得积分</th>
                  </tr>
                </thead>
                <tbody>
                  {studyRecords.map((record, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-700">{record.date}</td>
                      <td className="py-3 px-2 text-center">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                          {Math.floor(record.duration / 60)}h {record.duration % 60}m
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm">
                          {record.tasks} 个
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-medium">
                          +{record.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 右侧 - 打卡日历和分类 */}
        <div className="space-y-6">
          {/* 打卡按钮 */}
          <div className="bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl p-6 text-white text-center">
            <p className="text-white/80 mb-2">今日打卡</p>
            {todayPunched ? (
              <div>
                <div className="text-5xl mb-2">✅</div>
                <p className="font-bold text-lg">已完成打卡</p>
                <p className="text-white/70 text-sm mt-1">+50 积分已到账</p>
              </div>
            ) : (
              <button
                onClick={handlePunch}
                className="w-24 h-24 rounded-full bg-white/20 hover:bg-white/30 border-4 border-white/50 flex items-center justify-center mx-auto transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-3xl">👆</span>
              </button>
            )}
            {!todayPunched && (
              <p className="text-white/70 text-sm mt-3">点击打卡，获得 50 积分</p>
            )}
          </div>

          {/* 本月打卡日历 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <h2 className="text-lg font-bold text-gray-800">12月打卡</h2>
              </div>
              <span className="text-teal-500 text-sm font-medium">
                {monthData.filter(d => d.punched).length}/31 天
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-xs text-gray-400 py-1">{d}</div>
              ))}
              {/* 填充月初空白 */}
              {[...Array(0)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {monthData.slice(0, 31).map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    day.day === 14 
                      ? 'bg-teal-500 text-white ring-2 ring-teal-300' 
                      : day.punched 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  {day.day}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-100"></span> 已打卡
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-teal-500"></span> 今天
              </span>
            </div>
          </div>

          {/* 学习分类统计 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <h2 className="text-lg font-bold text-gray-800">分类统计</h2>
            </div>

            <div className="space-y-3">
              {categories.map(cat => {
                const catTasks = tasks.filter(t => t.category === cat.id)
                const completed = catTasks.filter(t => t.completed).length
                const total = catTasks.length
                const percent = total > 0 ? (completed / total) * 100 : 0
                
                return (
                  <div key={cat.id} className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center text-lg`}>
                      {cat.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        <span className="text-gray-400">{completed}/{total}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cat.color} transition-all duration-300`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 激励语 */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-5 border border-yellow-200">
            <p className="text-center">
              <span className="text-2xl">💪</span>
              <span className="block mt-2 text-gray-700 font-medium">
                "坚持就是胜利，今天也要加油！"
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 添加任务弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">添加学习任务</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* 任务名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">任务名称</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="输入学习任务..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* 分类选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择分类</label>
                <div className="grid grid-cols-5 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewTaskCategory(cat.id)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        newTaskCategory === cat.id 
                          ? `${cat.color} text-white ring-2 ring-offset-2 ring-gray-400` 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <p className="text-xs mt-1">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 预计时长 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预计时长: {newTaskDuration} 分钟
                </label>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>15分钟</span>
                  <span>3小时</span>
                </div>
              </div>

              {/* 预计积分 */}
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <span className="text-gray-600">完成可获得 </span>
                <span className="text-orange-500 font-bold text-lg">
                  {Math.floor(newTaskDuration / 10) * 5 + 10}
                </span>
                <span className="text-gray-600"> 积分</span>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  添加任务
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="text-center mt-8 text-gray-400 text-sm">
        <p>学习打卡 © 2024 | 每天进步一点点</p>
      </div>
    </div>
  )
}

export default App
