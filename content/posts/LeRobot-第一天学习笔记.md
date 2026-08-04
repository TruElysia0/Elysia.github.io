---
id: lerobot-learning-day-1
title: LeRobot 代码学习：第一天
date: 2026-08-01
category: 学习笔记
readTime: 5 分钟
accent: cyan
emoji: 📚
featured: false
excerpt: 理解 LeRobot 的命令入口、遥操作主流程、异常清理和控制循环频率。
tags: ["LeRobot", "Python", "代码阅读"]
draft: true
---

# LeRobot 代码学习：第一天

## 今日目标

- 了解终端命令如何进入对应的 Python 程序。
- 理解遥操作程序的整体执行流程。
- 理解控制循环如何读取观测、处理动作并控制频率。

## 核心笔记

### 1. 命令行入口

在 `pyproject.toml` 中：

```toml
lerobot-calibrate = "lerobot.scripts.lerobot_calibrate:main"
```

这不是把右侧程序的输出赋值给左侧，而是注册命令行入口：

- `lerobot-calibrate` 是终端命令名；
- `lerobot.scripts.lerobot_calibrate` 是 Python 模块路径；
- `main` 是模块中的入口函数。

执行命令的效果近似于：

```python
from lerobot.scripts.lerobot_calibrate import main

main()
```

### 2. 遥操作主流程

文件：`src/lerobot/scripts/lerobot_teleoperate.py`

主要步骤：

```text
读取配置
  ↓
创建遥操作器 teleop 和机器人 robot
  ↓
创建动作、观测处理器
  ↓
连接设备
  ↓
进入 teleop_loop()
  ↓
结束后断开设备
```

`@parser.wrap()` 会把命令行参数整理成配置对象，传给 `teleoperate(cfg)`。

### 3. 控制循环中的数据流

```python
obs = robot.get_observation()
raw_action = teleop.get_action()
teleop_action = teleop_action_processor((raw_action, obs))
robot_action_to_send = robot_action_processor((teleop_action, obs))
robot.send_action(robot_action_to_send)
```

- `obs` 是机器人的完整观测，可能包括相机图像、关节位置和其他传感器状态；
- `raw_action` 是遥操作设备产生的原始动作；
- `teleop_action` 是处理后的规范动作；
- `robot_action_to_send` 是最终发送给机器人的动作。

### 4. 异常处理与设备释放

```python
try:
    teleop_loop(...)
except KeyboardInterrupt:
    pass
finally:
    teleop.disconnect()
    robot.disconnect()
```

`try / except / finally` 是常见的任务执行和资源清理结构。用户按 `Ctrl+C` 会产生 `KeyboardInterrupt`，而 `finally` 保证无论正常结束还是异常退出，设备都会断开。

如果设置了 `duration`，循环达到运行时间后用 `return` 结束；如果 `duration=None`，则持续运行，通常通过 `Ctrl+C` 停止。

### 5. 控制频率

```python
precise_sleep(max(1 / fps - dt_s, 0.0))
```

每轮目标时间是 `1 / fps`。例如 `fps=50` 时目标周期为 `0.02` 秒；如果本轮已经使用 `0.015` 秒，则休眠 `0.005` 秒。`max(..., 0.0)` 可以防止剩余时间变成负数。

## 实践与问题

- 阅读了 `pyproject.toml` 中的命令入口配置。
- 阅读了 `lerobot_teleoperate.py` 的 `teleoperate()` 和 `teleop_loop()`。
- 区分了命令注册和变量赋值。
- 理解了 `try / except / finally` 的用途。
- 理解了观测、原始动作、处理后动作和最终执行动作之间的关系。
- 通过 `fps=50` 计算了控制周期和休眠时间。

## 明日计划

- 学习 `Robot` 抽象基类。
- 理解具体机器人如何实现统一接口。
- 了解机器人连接、校准、读取观测和发送动作的过程。
