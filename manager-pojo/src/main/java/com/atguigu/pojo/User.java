package com.atguigu.pojo;

/**
 * @author songhao
 * @create 2020-07-20 22:51
 * @Description: com.atguigu.pojo
 * @version: 1.0
 */
public class User {
    private Integer id;
    private String name;
    private Integer did;

    public User() {
    }

    public User(Integer id, String name, Integer did) {
        this.id = id;
        this.name = name;
        this.did = did;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDid() {
        return did;
    }

    public void setDid(Integer did) {
        this.did = did;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", did=" + did +
                '}';
    }
}
