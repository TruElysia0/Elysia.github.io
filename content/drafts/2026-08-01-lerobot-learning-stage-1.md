---
id: lerobot-learning-stage-1
title: LeRobot 代码学习：第一阶段总结
date: 2026-08-01
category: 学习笔记
readTime: 5 分钟
accent: cyan
emoji: 📚
featured: false
excerpt: 理解 LeRobot 的命令入口、遥操作主流程、异常清理机制以及控制循环的频率控制方法。
tags: ["LeRobot", "Python", "机器人", "代码阅读"]
draft: true
---

# LeRobot 代码学习：第一阶段总结

## 今日目标

- 了解终端命令如何进入对应的 Python 程序。
- 理解遥操作程序创建、连接和关闭设备的主流程。
- 理解遥操作循环中的观测、动作处理和频率控制。

## 核心笔记

### 1. 命令行入口

`pyproject.toml` 中的配置：

```toml
lerobot-calibrate = "lerobot.scripts.lerobot_calibrate:main"
```

不是把右侧程序的输出赋值给左侧，而是注册命令行入口：

- `lerobot-calibrate` 是终端命令名。
- `lerobot.scripts.lerobot_calibrate` 是 Python 模块路径。
- `main` 是执行该命令时调用的函数。

其效果近似于：

```python
from lerobot.scripts.lerobot_calibrate import main

main()
```

### 2. 遥操作程序的主流程

`teleoperate()` 的主要职责是：

1. 读取配置并初始化日志。
2. 根据配置创建遥操作器 `teleop` 和机器人 `robot`。
3. 创建动作与观测处理器。
4. 连接遥操作设备和机器人。
5. 调用 `teleop_loop()` 进入控制循环。
6. 循环结束后断开所有设备。

### 3. 遥操作循环的数据流

```text
机器人当前观测 obs
       ↓
遥操作原始动作 raw_action
       ↓
遥操作动作处理 teleop_action
       ↓
机器人动作处理 robot_action_to_send
       ↓
robot.send_action()
```

- `obs` 是机器人的完整观测，可能包含相机图像、关节位置和其他传感器状态，不只是视觉输入。
- `raw_action` 是遥操作设备直接产生的动作。
- `teleop_action` 是经过遥操作动作处理器转换后的规范动作。
- `robot_action_to_send` 是最终发送给具体机器人的可执行动作。

### 4. 异常处理与资源释放

```python
try:
    teleop_loop(...)
except KeyboardInterrupt:
    pass
finally:
    teleop.disconnect()
    robot.disconnect()
```

- `try` 中运行遥操作循环。
- 用户按下 `Ctrl+C` 会产生 `KeyboardInterrupt`。
- `finally` 无论正常结束还是发生异常都会执行，适合关闭串口、相机和机器人连接。
- 如果配置了 `duration`，达到运行时间后使用 `return` 退出循环；如果是 `None`，循环会持续运行，直到人为中断或发生异常。

### 5. 控制循环的频率

每轮目标时间为：

```text
目标周期 = 1 / fps
```

例如 `fps=50`，每轮目标时间是 `0.02` 秒。如果读取和发送动作已经用了 `0.015` 秒，还需要休眠 `0.005` 秒。

```python
precise_sleep(max(1 / fps - dt_s, 0.0))
```

`max(..., 0.0)` 可以避免处理时间超过目标周期后出现负数休眠时间。如果程序处理一轮所需时间过长，实际运行频率会低于目标 `fps`。

## 实践与问题

- 阅读了 `pyproject.toml` 中的命令行入口配置。
- 阅读了 `lerobot_teleoperate.py` 中的 `teleoperate()` 和 `teleop_loop()` 主流程。
- 理清了命令注册与变量赋值的区别。
- 理解了 `try / except / finally` 在硬件资源管理中的用途。
- 找到了遥操作循环的结束条件：运行时间到达、`Ctrl+C` 中断或程序异常。
- 通过 `fps=50` 的例子计算了目标周期和剩余休眠时间，并理解了使用 `max()` 防止负数的方法。

## 明日计划

- 进入第二阶段，学习 `Robot` 抽象基类。
- 理解 `self`、`config` 和对象属性。
- 了解不同具体机器人如何遵守统一的 `Robot` 接口。
