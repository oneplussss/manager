package com.atguigu.mapper;

import com.atguigu.pojo.User;

import java.util.List;

/**
 * @author songhao
 * @create 2020-07-20 22:53
 * @Description: com.atguigu.mapper
 * @version: 1.0
 */
public interface UserMapper {
    void insert(User user);

    List<User> selectUsers();
}
