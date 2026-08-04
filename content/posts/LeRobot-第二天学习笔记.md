---
id: lerobot-learning-day-2
title: LeRobot 代码学习：第二天
date: 2026-08-04
category: 学习笔记
readTime: 7 分钟
accent: cyan
emoji: 📚
featured: false
excerpt: 理解 Robot 抽象接口、SOFollower 具体实现，以及机器人工厂函数如何根据配置创建对象。
tags: ["LeRobot", "机器人", "Robot", "代码阅读"]
draft: false
---

# LeRobot 代码学习：第二天

## 今日目标

- 理解 `Robot` 抽象基类的作用。
- 理解 `SOFollower` 如何实现机器人接口。
- 理解机器人连接、校准、配置、观测和动作执行流程。
- 理解工厂函数如何根据配置创建不同机器人。

## 核心笔记

### 1. Robot 是统一接口

文件：`src/lerobot/robots/robot.py`

```python
class Robot(abc.ABC):
```

`Robot` 不是某一个具体机器人，而是所有机器人共同遵守的抽象基类。它规定了统一接口：

```text
connect()
calibrate()
configure()
get_observation()
send_action()
disconnect()
```

`@property` 让方法可以像属性一样访问，例如：

```python
robot.observation_features
```

`@abc.abstractmethod` 表示父类只规定接口，具体子类必须实现方法。父类中的 `pass` 表示这里不提供具体实现。

### 2. 配置与校准文件路径

```python
self.calibration_fpath = self.calibration_dir / f"{self.id}.json"
```

`self` 表示当前对象，`config` 表示创建机器人时传入的配置。`Path / 文件名` 是 `pathlib.Path` 提供的路径拼接写法。

例如：

```text
校准目录 + 机器人 ID.json
→ C:\robot\calibration\left_arm.json
```

### 3. SOFollower 的具体实现

文件：`src/lerobot/robots/so_follower/so_follower.py`

```python
class SOFollower(Robot):
```

表示 `SOFollower` 继承并实现 `Robot` 的接口。初始化时：

```python
super().__init__(config)
```

先调用父类初始化通用信息，然后创建自己的电机总线和相机。

它的特征定义是：

```text
observation_features = 电机位置 + 相机图像尺寸
action_features      = 电机位置目标
```

相机提供观测，但不属于动作输出。

### 4. 连接、校准和配置

`SOFollower.connect()` 的顺序是：

```text
检查是否已经连接
  ↓
连接电机总线
  ↓
如果需要则校准
  ↓
连接所有相机
  ↓
应用电机配置
```

`is_connected` 只有在电机总线和所有相机都连接时才返回 `True`。

校准时，如果存在已有校准数据，程序会询问用户是直接使用还是重新校准。现场校准会：

```text
关闭电机扭矩
  ↓
记录中位偏移
  ↓
记录关节运动范围
  ↓
写入电机
  ↓
保存 JSON 文件
```

`configure()` 会设置电机控制参数。`P_Coefficient`、`I_Coefficient` 和 `D_Coefficient` 属于 PID 控制参数；夹爪还会设置扭矩、电流和过载保护参数。

### 5. 读取观测

```python
obs_dict = self.bus.sync_read("Present_Position")
```

同步读取电机当前位置；相机使用 `async_read()` 读取图像。最终返回的是 Python 字典，不是 JSON：

```python
{
    "shoulder_pan.pos": 120.5,
    "front_camera": image_array,
}
```

如果机器人没有连接，`get_observation()` 会抛出设备未连接异常。

### 6. 发送动作

`send_action()` 的流程是：

```text
接收统一动作格式
  ↓
去掉字段名中的 .pos
  ↓
检查目标位置与当前位置的相对距离
  ↓
必要时裁剪到安全范围
  ↓
写入 Goal_Position
  ↓
返回实际发送的动作
```

`Present_Position` 是电机当前位置，`Goal_Position` 是希望电机到达的目标位置。`max_relative_target` 限制的是目标位置相对当前位置的最大移动量。

### 7. 机器人工厂函数

文件：`src/lerobot/robots/utils.py`

```python
robot = make_robot_from_config(config)
```

工厂函数读取 `config.type`，根据类型选择具体类：

```text
so100_follower → SO100Follower
so101_follower → SO101Follower
reachy2        → Reachy2Robot
lekiwi         → LeKiwi
```

调用方不需要自己判断机器人类型，只需要调用统一的工厂函数。这使程序可以兼容多种机器人。

## 实践与问题

- 理解了抽象类、继承、`self`、`super()` 和 `@property`。
- 理解了单下划线方法主要表示内部辅助方法。
- 理解了 `connect()`、`calibrate()` 和 `configure()` 的区别。
- 理解了 `get_observation()` 如何读取电机和相机数据。
- 理解了 `send_action()` 如何进行安全检查和动作转换。
- 理解了工厂函数根据配置创建不同具体机器人的方式。

## 明日计划

- 开始 PushT 仿真训练示例。
- 阅读 `examples/training/train_policy.py`。
- 先理解数据集 metadata、输入特征、输出特征和 Diffusion Policy 配置之间的关系。
