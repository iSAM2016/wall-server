## ls

1. FP
2. nestjs 是 node 版本的 spring
3. nestjs ioc 的实现原理
4. 手写 express + nodejs
5. NGINX redis mysql
6. cli
7. 架构研究
8. ssm 连接池
9. 减少 nest 循环依赖注入深坑

## 配置

- service 中不要写 try catch 否则异常捕获不到 \*

MySQL 5.6-pass:abc123456 uV,0ejdn&.c#

## 2 restful

rest 是一种设计风格他不是一种标准 也不是一种软件 而是一种思想 res
rest 通常基于使用 HTTP URI 和 XML JSON 以及 HTML 这些现有的的广泛的协议和标准

### 2.1 rest 架构 的主要原则

1. 网络上的所有事物都被抽象为资源
2. 每个资源都有一个唯一的资源标识符
3. 同一个资源具有多种表现形式 xml json
4. 对资源的各种操作都不会改变资源标识符
5. 所有的操作都是无状态的

### 2.2 资源操作

- http:example.com/users/
  - GET: 获取一个 xinyuan
  - POST: 创建一个资源
  - PUT: 修改一个资源的状态
  - DELETE: 删除一个资源

用 http 的方法作为对资源操作的方法幂等性

### 2.3 rest 接口设计 最佳实践

url 组成:

- --网路协议
- -- 服务器地址
- -- 接口名称
- --? 参数列表

URL 定义限定

- 不要使用大写的字母
- 使用- 代替下划线\_
- 参数列表应该被 encode 过

### 2.4 响应设计

content body 仅仅用来传输数据数据要定义为拿来就用的原则永爱描述数据或者请求的元数据放 header 中 例如`x-result-fileds`

```
错误

{
status： 200，
data:{
  name: 1214,
  age: isam2016
 }
}

正确
response Header： status 200
response Body {
   name: 1214,
  age: isam2016
}

```

## spring

spring 是一个 ioc(DI) 和 AOP 容器框架

1. 配置形式 xml
2. Bean 的配置方式： 全反射
   - ioc：控制反转（模式概念）
     - DI: 依赖注入（属性注入）的方式，(ioc 的实现方式)
     - 属性注入通过 setter 方法注入 Bean 的属性值或依赖的对象

- class: bean 的全类名 通过反射的方式在 IOC 容器中创建 Bean 所以 Bean 中需要无参数的容器
- id: bean 的名称
- spring 容器，在 spring IOC 容器读取 Bean 配置创建 Bean 之前 必须对他进行实例化 只有在容器实例化后 才可以从 IOC 容器里获取 Bean 实例并且使用
- ApplicationContext 在初始上下文时就实例化所有单例的 Bean

3. 注入属性值细节
   - a.字面值；可用字符串表示的值可以通过`<value>` 元素标签或 value 进行注入 例如 `<constructor-arg index="3"><value>30</value></constructor-arg>`
   - b. 引用
     - -- 在 Bean 的配置文件中, 可以通过`<ref>`元素或`ref`属性为`Bean`的属性或构造器参数指定对 Bean 的引用.
     - --也可以在属性或构造器里包含 Bean 的声明, 这样的 Bean 称为内部 Bean
   - c. 集合属性
     - --1.在 spring 中可以通过一组内置的 xml 标签 例如 list set map 来配置集合属性
     - --2. list 标签 在标签里，list 可以包含简单的元素
       - value 配置简单的值
       - ref 对 bean 的引用
     - --3. map 集合
       - map 标签里可以使用多个<entry> 作为子标签 每个条目都包含一个键和一个值
         - 必须在 key 里面包含键
         - 因为键和值的类型没有限制 所有可以自由的为他们制制定 value,ref bean. null
         - 可以将 Map 的键和值作为 <entry> 的属性定义: 简单常量使用 key 和 value 来定义; Bean 引用通过 key-ref 和 value-ref 属性定义使用 <props> 定义 java.util.Properties, 该标签使用多个 <prop> 作为子标签. 每个 <prop> 标签必须定义 key 属性

## AOP

需求 1-日志：在程序执行期间追踪正在发生的活动

需求 2-验证：希望计算器只能处理正数的运算

前奏问题

- 代码混乱-越来越多的非业务需求(日志和验证等)加入后, 原有的业务方法急剧膨胀. 每个方法在处理核心逻辑的同时还必须兼顾其他多个关注点.
- 代码分散-以日志需求为例, 只是为了满足这个单一需求, 就不得不在多个模块（方法）里多次重复相同的日志代码. 如果日志需求发生变化, 必须修改所有模块.

代理设计模式的原理: 使用一个代理将对象包装起来, 然后用该代理对象取代原始对象. 任何对原始对象的调用都要通过代理. 代理对象决定是否以及何时将方法调用转到原始对象上.

[](./WX20191125-161318@2x.png)
[](./WX20191125-161318@2x.png)

- AOP: 面向切片编程 是一种新的方法论 是对传统 OOP 的补充
- AOP 的主要编程对象是切面， 而切面模块化横切 关注点
- 在应用 AOP 编程时候 仍然需要定义公共功能，但可以明确的定义这个功能在哪里，以什么方式应用，并且不修改受影响的类， 这样一来横切关注点就被模块化
- 到特殊的对象切面里
- AOP: 每个事物逻辑位于一个位置 代码不分散 便于升级和维护业务模块更简单

- 切面： 横切关注点 跨越应用程序多个模块的功能 被模块化的特殊对象
- 通知： 切面必须要完成的工作
- 目标： 被通知的对象
- 代理： 向目标对象应用通知之后创建的对象
- 连接点（Joinpoint）：程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位。例如 ArithmethicCalculator#add() 方法执行前的连接点，执行点为 ArithmethicCalculator#add()； 方位为该方法执行前的位置
- 切点（pointcut）：每个类都拥有多个连接点：例如 ArithmethicCalculator 的所有方法实际上都是连接点，即连接点是程序类中客观存在的事务。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件。

## spring AOP 实现的方式

- 1.引入包
- 2.在配置文件中加入 aop 的命名空间`<context:component-scan base-package="com.atguigu.spring.aop"></context:component-scan>`

- 3.基于注解的方式
  - a. 配置文件中加入如下的配置：`<aop:aspectj-autoproxy></aop:aspectj-autoproxy>`
  - b.把横切关注点的代码抽象到切面类中
    - i: 切面首先是一个 IOC 的 bean, 即加入 @Component 注解
    - ii: 切面还需加入@Aspect 注解
  - c. 在类中声明各种通知：
    - i:声明一个方法
    - ii: 在方法前加入@Before 注解
  - d. 可以在通知方法中声明一个类型为 JointPoint 的参数然后就能访问链接细节 入方法名称和参数值

### bean 的作用域

### 通过工厂方式配置 Bean 略

### bean 的生命周期 略

### factoryBean 配置 Bean 略

### 通过注解配置 bean

在 classpath 中扫描组件,特定组件包括

- @Component
- @Respository
- @service
- @Controller

当组件类上使用了特定的注解以后 还需要在 spring 的配置文件中声明`<contextcomponent-scan>`

### bean 和 bean 的关联关系

使用@autowired 自动装配 Bean 自动装配具有兼容类型的单个 Bean 属性

- 构造器 普通字段-即使是非 public 一切具有参数的方法都可以应用@Autowired 注解
- 默认情况下 所有使用@autowired 注解的属性都是 需要被设置
- 默认情况下 当 IOC 容器里存在多个类型加农的 Bean 时 通过类型的自动装配 将无法工作 此时可以在

SDK 关于捕获错误的需求列表

- 提供’面包屑‘记录当前错误发生之前用户行为，将当前 error 和之前的用户行为上报

- 面包屑提供自定义错误日志 addBreadcrumb
  - message 描述信息的字符串
  - data 数据源
  - category 类别
  - level 级别
    - fatal
    - error
    - warning
    - info

前端错误数据采集

1. 资源加载错误
2. js 执行错误
3. promise 错误

4. 通过 addEventListener("error",callback,true) 在捕获阶段捕捉资源加载失败错误
5. 通过 winsow.error 捕获 js
6. addEventListerer("unhandledrejection",callback) 捕获 promise 错误
