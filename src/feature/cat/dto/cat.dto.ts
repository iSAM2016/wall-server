// 相当于java 中的pojo
// mapper 是一个接口文件
export abstract class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}

// public abstract class BasePojo {

//   private Date created;
//   private Date updated;
//   public Date getCreated() {
//       return created;
//   }
//   public void setCreated(Date created) {
//       this.created = created;
//   }
//   public Date getUpdated() {
//       return updated;
//   }
//   public void setUpdated(Date updated) {
//       this.updated = updated;
//   }

// }
