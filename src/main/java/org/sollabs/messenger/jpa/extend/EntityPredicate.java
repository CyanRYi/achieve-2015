package org.sollabs.messenger.jpa.extend;

import java.util.Collection;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CollectionPath;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.core.types.dsl.StringPath;

public class EntityPredicate<T> {
	
    private Class<? extends T> clazz;

    public EntityPredicate(Class<? extends T> clazz) {
        this.clazz = clazz;
    }

    public BooleanExpression getPredicate(SearchCriteria criteria) {
        final PathBuilder<T> entityPath = new PathBuilder<T>(clazz, clazz.getSimpleName().toLowerCase());

        if (entityPath.get(criteria.getKey()).instanceOf(Collection.class).equals(true)) {
        	final CollectionPath<?, ?> path = entityPath.getCollection(criteria.getKey(), criteria.getValue().getClass());
        	
        	/*switch(criteria.getOperation()) {
        		case "ct" : return path.contains(criteria.getValue().getClass().cast(criteria.getValue()));
        		case "size" : return path.size().eq((Integer) criteria.getValue());
        	}*/
        	
        	
        } else if (isNumeric(criteria.getValue().toString())) {

    		final NumberPath<Integer> path = entityPath.getNumber(criteria.getKey(), Integer.class);
            final int value = Integer.parseInt(criteria.getValue().toString());
            
            switch(criteria.getOperation()) {
            	case "eq" : return path.eq(value);
            	case "ne" : return path.ne(value);
            	case "ge" : return path.goe(value);
            	case "gt" : return path.gt(value);
            	case "le" : return path.loe(value);
            	case "lt" : return path.lt(value);
            }
        } else {
            final StringPath path = entityPath.getString(criteria.getKey());
            final String value = criteria.getValue().toString().toLowerCase();
            
            switch(criteria.getOperation()) {
            	case "eq" : return path.eq(value);
            	case "ne" : return path.ne(value);
            	case "ct" : return path.containsIgnoreCase(value);
            }
        }
        	
        return null;
    }

    public static boolean isNumeric(final String str) {
        try {
            Integer.parseInt(str);
        } catch (final NumberFormatException e) {
            return false;
        }
        return true;
    }
}