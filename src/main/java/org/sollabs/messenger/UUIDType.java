package org.sollabs.messenger;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.UUID;

import org.hibernate.HibernateException;
import org.hibernate.MappingException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.usertype.UserType;

public class UUIDType implements UserType {

	   /*
	    * Return the SQL type codes for the columns mapped by this type. The
	    * codes are defined on <tt>java.sql.Types</tt>.
	    */
	   @Override
	   public int[] sqlTypes() {
	      return new int[] { Types.OTHER };
	   }

	   @Override
	   public boolean equals(Object o1, Object o2) throws HibernateException {
	      if (o1 == null && o2 == null) {
	         return true;
	      } else if (o1 == null || o2 == null) {
	         return false;
	      }
	      UUID u1 = (UUID) o1;
	      UUID u2 = (UUID) o2;
	      return u1.equals(u2);
	   }

	   @Override
	   public int hashCode(Object o) throws HibernateException {
	      return o.hashCode();
	   }

	   @SuppressWarnings("rawtypes")
	   @Override
	   public Class returnedClass() {
	      return UUID.class;
	   }

	   /*
	    * Retrieve an instance of the mapped class from a JDBC resultset.
	    */
	   @Override
	   public Object nullSafeGet(ResultSet rs, String[] names, SessionImplementor session, Object owner)
	         throws HibernateException, SQLException {
	      Object val = rs.getObject(names[0]);
	      if (val instanceof UUID || val == null) {
	         return val;
	      } else {
	         throw new MappingException("Unexpected Object type " + val.getClass() + " for UUID");
	      }
	   }

	   /*
	    * Write an instance of the mapped class to a prepared statement.
	    */
	   @Override
	   public void nullSafeSet(PreparedStatement st, Object value, int index,
	         SessionImplementor session) throws HibernateException, SQLException {
	      st.setObject(index, value);
	   }

	   @Override
	   public Object deepCopy(Object o) throws HibernateException {
	      // UUID is immutable
	      return o;
	   }

	   @Override
	   public boolean isMutable() {
	      return false;
	   }

	   @Override
	   public Serializable disassemble(Object o) throws HibernateException {
	      return (Serializable) o;
	   }

	   @Override
	   public Object assemble(Serializable cached, Object owner) throws HibernateException {
	      return cached;
	   }

	   @Override
	   public Object replace(Object original, Object target, Object owner) throws HibernateException {
	      return original;
	   }
	}
