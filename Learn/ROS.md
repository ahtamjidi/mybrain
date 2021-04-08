First problem I had was to install ROS2 along ROS using an external hard drive. That is, I want to have access to both ROS and ROS2 and use my external hard drive for storage purposes.
lxd and virtual machines are possible solutions.

- [How to install ROS using linux containers LXD](https://ubuntu.com/blog/ros-development-with-lxd) #ros #howto
- https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04


```cpp
int main() {
   World world{};
    Agent a;
	world.register(a);
	while(ros_ok) {
	   world.step()
	}
}

World::step() {
// comms sim
// for 
}
Agent::observe(World& world) {
	// world
	
}

Agent::step() {
	mm.step();
	publish_state();
}

/// Workd with 2 agents and communication

Eigen + Sophus (differentail geometry) 
```


Nodelet: zero copy message passing and you can load dynamically
Today at 

## Multi agent simulation with ROS 2
- https://discourse.ros.org/t/ros2-for-multi-robot-system/8619/5
- [ns3+ros](https://github.com/nps-ros2/ns3_gazebo): This repository provides setup scripts and code for simulating distributed software.
- [ROS-NetSim:  A  Framework  for  the  Integration  of Robotic  and  Network  Simulators](https://www.seas.upenn.edu/~cfullana/pubs/c_2020_calvo-fullana_et_al_a.pdf): Multi-agent systems play an important role in modern robotics. Due to the nature of these systems, coor-dination among agents via communication is frequently nec-essary. Indeed, Perception-Action-Communication (PAC) loops,or Perception-Action loops closed over a communication chan-nel, are a critical component of multi-robot systems. However,we lack appropriate tools for simulating PAC loops. To that end,in this paper, we introduce ROS-NetSim, a ROS package that acts as an interface between robotic and network simulators.With ROS-NetSim, we can attain high-fidelity representations ofboth robotic and network interactions by accurately simulating the PAC loop. Our proposed approach is lightweight, modular and adaptive. Furthermore, it can be used with many available network and physics simulators by making use of our proposed interface. In summary, ROS-NetSim is (i) Transparent to the ROS target application, (ii) Agnostic to the specific network and physics simulator being used, and (iii) Tunable in fidelity and complexity. As part of our contribution, we have made available an open-source implementation of ROS-NetSim to the community.
- [A Multi-Agent Simulator Environment Based onthe Robot Operating System for Human-RobotInteraction Applications](https://www.cs.nmsu.edu/~ppianpak/2018-PRIMA/full.pdf)
- 

## Resources 
- [Robotics Recap: Learning, Programming & Snapping ROS 2](https://ubuntu.com/blog/robotics-recap-learning-programming-and-snapping-ros-2) I learned about lxd (linux containers) and how we can use them to install ROS from articles in here.
- [ROS 2 tutorials](https://index.ros.org/doc/ros2/Tutorials/)
- [ROS 2 Video tutorials from the construct](https://www.youtube.com/playlist?list=PLK0b4e05LnzYNBzqXNm9vFD9YXWp6honJ)
- [Install ROS in an LXD Container](https://www.youtube.com/watch?v=bFJp7WAfcXk&feature=emb_title)
- [Roscon videos](https://index.ros.org/doc/ros2/ROSCon-Content/) #video #conference #ros 
- [ROS Industrial (Melodic) Training Exercises](https://industrial-training-master.readthedocs.io/en/melodic/index.html)
- [ ] [ROS with Docker](https://tuw-cpsg.github.io/tutorials/docker-ros/) #ros has examples of how to use the host workspace as a volume in docker

CS-27 for ROS on UAV