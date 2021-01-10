### Memory Model
C++ memory model allowed programmers to write portable multi-threaded code after C++11. The model ensures something called sequential consistency, meaning operations among threads can be interleaved but if two atomic operations happen after each other in one thread they are guaranteed to happen after each other when the compiled code runs. Note that compiler could change the order of execution for optimization purposes when such guarantees do not exist.

```cpp
// Global
atomic<int> x, y; // initialized to 0

// Thread 1 (A)              //Thread 2 (B)
x.store(27);                 cout << "y = " << y .load() << " ";
y.store(37);                 cout << "x = " << x.load() << "\n";
```

A_1 --> A_2 --> B_1 --> B_2 ==> 37 27
A_1 --> B_1 --> B_2 --> A_2 ==> 0 27
A_1 --> B_1 --> A_2 --> B_2 ==> 0 27
B_1 --> A_1 --> B_2 --> A_2 ==> 0 27
B_1 --> B_2 --> A_1 --> A_2 ==> 0 0



### References
- [C++11 introduced a standardized memory model. What does it mean? And how is it going to affect C++ programming?](https://stackoverflow.com/questions/6319146/c11-introduced-a-standardized-memory-model-what-does-it-mean-and-how-is-it-g)
- [Concurrency and the C++ Memory Model - Pavel Yosifovich](https://corecppil.github.io/Meetups/2018-06-28_Lightening-Storm/ConcurrencyCppMemoryModel.pdf) and its [youtube](https://www.youtube.com/watch?v=NZ_ncor_Lj0) 
